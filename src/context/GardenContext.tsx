import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { GardenPlant, MaintenanceTask, MaintenanceCadence, MaintenanceSession } from "@/types/plants";
import { z } from "zod";
import { PLANT_DATABASE } from "@/data/plantDatabase";
import { addDays, addWeeks, addMonths, format, isBefore, startOfDay, startOfWeek, endOfWeek, eachWeekOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

interface GardenContextType {
  gardenPlants: GardenPlant[];
  tasks: MaintenanceTask[];
  addPlant: (plantId: string, zone: string) => void;
  removePlant: (gardenPlantId: string) => void;
  completeTask: (taskId: string) => void;
  todayTasks: MaintenanceTask[];
  upcomingTasks: MaintenanceTask[];
  overdueTasks: MaintenanceTask[];
  cadence: MaintenanceCadence;
  setCadence: (c: MaintenanceCadence) => void;
  maintenanceSessions: MaintenanceSession[];
  preferredDay: number;
  setPreferredDay: (d: number) => void;
}

const GardenContext = createContext<GardenContextType | null>(null);

export const useGarden = () => {
  const ctx = useContext(GardenContext);
  if (!ctx) throw new Error("useGarden must be used within GardenProvider");
  return ctx;
};

function generateTasks(gardenPlants: GardenPlant[]): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = [];
  const today = format(new Date(), "yyyy-MM-dd");

  gardenPlants.forEach((gp) => {
    const baseDate = parseISO(gp.addedDate);

    // Water tasks
    const lastWatered = gp.lastWatered ? parseISO(gp.lastWatered) : baseDate;
    const nextWater = addDays(lastWatered, gp.plant.waterFrequencyDays);
    tasks.push({
      id: `${gp.id}-water`,
      gardenPlantId: gp.id,
      plantName: gp.plant.name,
      type: "water",
      dueDate: format(nextWater, "yyyy-MM-dd"),
      completed: gp.lastWatered === today,
    });

    // Fertilize tasks
    const lastFert = gp.lastFertilized ? parseISO(gp.lastFertilized) : baseDate;
    const nextFert = addDays(lastFert, gp.plant.fertilizerFrequencyDays);
    tasks.push({
      id: `${gp.id}-fertilize`,
      gardenPlantId: gp.id,
      plantName: gp.plant.name,
      type: "fertilize",
      dueDate: format(nextFert, "yyyy-MM-dd"),
      completed: gp.lastFertilized === today,
    });

    // Prune tasks
    const lastPruned = gp.lastPruned ? parseISO(gp.lastPruned) : baseDate;
    const nextPrune = addDays(lastPruned, gp.plant.pruneFrequencyDays);
    tasks.push({
      id: `${gp.id}-prune`,
      gardenPlantId: gp.id,
      plantName: gp.plant.name,
      type: "prune",
      dueDate: format(nextPrune, "yyyy-MM-dd"),
      completed: gp.lastPruned === today,
    });
  });

  return tasks;
}

const storageKey = "greenthumb.garden.v1";
const savedGardenSchema = z.object({
  plants: z.array(z.object({
    id: z.string(),
    plantId: z.string(),
    zone: z.string(),
    addedDate: z.string().date(),
    lastWatered: z.string().date().optional(),
    lastFertilized: z.string().date().optional(),
    lastPruned: z.string().date().optional(),
  })),
  cadence: z.enum(["weekly", "biweekly", "monthly"]),
  preferredDay: z.number().int().min(0).max(6),
});

function loadGarden(): {
  gardenPlants: GardenPlant[];
  cadence: MaintenanceCadence;
  preferredDay: number;
} {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const { plants, cadence, preferredDay } = savedGardenSchema.parse(JSON.parse(saved));
      const gardenPlants = plants.flatMap(({ plantId, id, zone, addedDate, ...care }) => {
        const plant = PLANT_DATABASE.find((item) => item.id === plantId);
        return plant ? [{ id, zone, addedDate, plant, ...care }] : [];
      });
      return { gardenPlants, cadence, preferredDay };
    }
  } catch {
    // The garden can still be used when browser storage is unavailable.
  }
  return { gardenPlants: [], cadence: "weekly", preferredDay: 6 };
}

function buildSessions(
  tasks: MaintenanceTask[],
  cadence: MaintenanceCadence,
  preferredDay: number
): MaintenanceSession[] {
  const incompleteTasks = tasks.filter((t) => !t.completed);
  if (incompleteTasks.length === 0) return [];

  const today = startOfDay(new Date());
  const lookAhead = cadence === "monthly" ? addMonths(today, 3) : cadence === "biweekly" ? addWeeks(today, 8) : addWeeks(today, 6);

  const sessions: MaintenanceSession[] = [];

  if (cadence === "monthly") {
    const months = eachMonthOfInterval({ start: today, end: lookAhead });
    months.forEach((monthStart, i) => {
      const mStart = startOfMonth(monthStart);
      const mEnd = endOfMonth(monthStart);
      const sessionTasks = incompleteTasks.filter((t) => {
        const d = parseISO(t.dueDate);
        return isWithinInterval(d, { start: mStart, end: mEnd }) || (isBefore(d, mStart) && i === 0);
      });
      if (sessionTasks.length > 0) {
        sessions.push({
          id: `session-${format(mStart, "yyyy-MM")}`,
          label: format(mStart, "MMMM yyyy"),
          dateRange: { start: format(mStart, "yyyy-MM-dd"), end: format(mEnd, "yyyy-MM-dd") },
          tasks: sessionTasks,
        });
      }
    });
  } else {
    const weekInterval = cadence === "biweekly" ? 2 : 1;
    const weeks = eachWeekOfInterval({ start: today, end: lookAhead }, { weekStartsOn: 0 });
    const filteredWeeks = weeks.filter((_, i) => i % weekInterval === 0);

    filteredWeeks.forEach((weekStart, i) => {
      const wStart = startOfWeek(weekStart, { weekStartsOn: 0 });
      const wEnd = endOfWeek(addWeeks(wStart, weekInterval - 1), { weekStartsOn: 0 });
      const preferredDate = addDays(wStart, preferredDay);
      const plannedDate = isBefore(preferredDate, today)
        ? addWeeks(preferredDate, 1)
        : preferredDate;
      const sessionTasks = incompleteTasks.filter((t) => {
        const d = parseISO(t.dueDate);
        return isWithinInterval(d, { start: wStart, end: wEnd }) || (isBefore(d, wStart) && i === 0);
      });
      if (sessionTasks.length > 0) {
        sessions.push({
          id: `session-${format(wStart, "yyyy-MM-dd")}`,
          label: cadence === "biweekly"
            ? `${format(wStart, "MMM d")} – ${format(wEnd, "MMM d")}`
            : `Week of ${format(wStart, "MMM d")}`,
          plannedDate: isBefore(wEnd, plannedDate) ? undefined : format(plannedDate, "yyyy-MM-dd"),
          dateRange: { start: format(wStart, "yyyy-MM-dd"), end: format(wEnd, "yyyy-MM-dd") },
          tasks: sessionTasks,
        });
      }
    });
  }

  return sessions;
}

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialGarden] = useState(loadGarden);
  const [gardenPlants, setGardenPlants] = useState(initialGarden.gardenPlants);
  const [cadence, setCadence] = useState(initialGarden.cadence);
  const [preferredDay, setPreferredDay] = useState(initialGarden.preferredDay);

  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const plants = gardenPlants.map(({ plant, ...entry }) => ({ ...entry, plantId: plant.id }));
      window.localStorage.setItem(storageKey, JSON.stringify({ plants, cadence, preferredDay }));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [gardenPlants, cadence, preferredDay]);

  const allTasks = generateTasks(gardenPlants);
  const today = startOfDay(new Date());
  const todayStr = format(today, "yyyy-MM-dd");

  const todayTasks = allTasks.filter((t) => t.dueDate === todayStr && !t.completed);
  const overdueTasks = allTasks.filter(
    (t) => isBefore(parseISO(t.dueDate), today) && t.dueDate !== todayStr && !t.completed
  );
  const upcomingTasks = allTasks.filter(
    (t) => !isBefore(parseISO(t.dueDate), today) && t.dueDate !== todayStr && !t.completed
  );

  const maintenanceSessions = useMemo(
    () => buildSessions(allTasks, cadence, preferredDay),
    [allTasks, cadence, preferredDay]
  );

  const addPlant = useCallback((plantId: string, zone: string) => {
    const plant = PLANT_DATABASE.find((p) => p.id === plantId);
    if (!plant) return;
    const newGP: GardenPlant = {
      id: `gp-${Date.now()}`,
      plant,
      addedDate: format(new Date(), "yyyy-MM-dd"),
      zone,
    };
    setGardenPlants((prev) => [...prev, newGP]);
  }, []);

  const removePlant = useCallback((gardenPlantId: string) => {
    setGardenPlants((prev) => prev.filter((gp) => gp.id !== gardenPlantId));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    const completedDate = format(new Date(), "yyyy-MM-dd");
    setGardenPlants((prev) =>
      prev.map((gp) => {
        if (taskId === `${gp.id}-water`) return { ...gp, lastWatered: completedDate };
        if (taskId === `${gp.id}-fertilize`) return { ...gp, lastFertilized: completedDate };
        if (taskId === `${gp.id}-prune`) return { ...gp, lastPruned: completedDate };
        return gp;
      })
    );
  }, []);

  return (
    <GardenContext.Provider
      value={{
        gardenPlants,
        tasks: allTasks,
        addPlant,
        removePlant,
        completeTask,
        todayTasks,
        upcomingTasks,
        overdueTasks,
        cadence,
        setCadence,
        maintenanceSessions,
        preferredDay,
        setPreferredDay,
      }}
    >
      {storageError && (
        <p role="alert" className="p-3 text-center text-sm text-destructive">
          This browser could not save your garden. Changes may be lost when you leave or refresh.
        </p>
      )}
      {children}
    </GardenContext.Provider>
  );
};
