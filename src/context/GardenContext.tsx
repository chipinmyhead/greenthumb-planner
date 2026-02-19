import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { GardenPlant, MaintenanceTask, MaintenanceCadence, MaintenanceSession } from "@/types/plants";
import { PLANT_DATABASE } from "@/data/plantDatabase";
import { addDays, addWeeks, addMonths, format, isBefore, startOfDay, startOfWeek, endOfWeek, eachWeekOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

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
  const today = startOfDay(new Date());

  gardenPlants.forEach((gp) => {
    const baseDate = new Date(gp.addedDate);

    // Water tasks
    const lastWatered = gp.lastWatered ? new Date(gp.lastWatered) : baseDate;
    const nextWater = addDays(lastWatered, gp.plant.waterFrequencyDays);
    tasks.push({
      id: `${gp.id}-water`,
      gardenPlantId: gp.id,
      plantName: gp.plant.name,
      type: "water",
      dueDate: format(nextWater, "yyyy-MM-dd"),
      completed: false,
    });

    // Fertilize tasks
    const lastFert = gp.lastFertilized ? new Date(gp.lastFertilized) : baseDate;
    const nextFert = addDays(lastFert, gp.plant.fertilizerFrequencyDays);
    tasks.push({
      id: `${gp.id}-fertilize`,
      gardenPlantId: gp.id,
      plantName: gp.plant.name,
      type: "fertilize",
      dueDate: format(nextFert, "yyyy-MM-dd"),
      completed: false,
    });

    // Prune tasks
    const lastPruned = gp.lastPruned ? new Date(gp.lastPruned) : baseDate;
    const nextPrune = addDays(lastPruned, gp.plant.pruneFrequencyDays);
    tasks.push({
      id: `${gp.id}-prune`,
      gardenPlantId: gp.id,
      plantName: gp.plant.name,
      type: "prune",
      dueDate: format(nextPrune, "yyyy-MM-dd"),
      completed: false,
    });
  });

  return tasks;
}

// Pre-populate with a few plants
function getInitialGardenPlants(): GardenPlant[] {
  const today = format(new Date(), "yyyy-MM-dd");
  const threeDaysAgo = format(addDays(new Date(), -3), "yyyy-MM-dd");
  const weekAgo = format(addDays(new Date(), -7), "yyyy-MM-dd");

  return [
    {
      id: "gp1",
      plant: PLANT_DATABASE[0], // Boxwood
      addedDate: weekAgo,
      zone: "Front Yard",
      lastWatered: threeDaysAgo,
    },
    {
      id: "gp2",
      plant: PLANT_DATABASE[4], // Rose Bush
      addedDate: weekAgo,
      zone: "Back Garden",
      lastWatered: threeDaysAgo,
    },
    {
      id: "gp3",
      plant: PLANT_DATABASE[2], // Hydrangea
      addedDate: weekAgo,
      zone: "Side Yard",
      lastWatered: today,
    },
  ];
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
        const d = new Date(t.dueDate);
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
      const wEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
      const sessionTasks = incompleteTasks.filter((t) => {
        const d = new Date(t.dueDate);
        return isWithinInterval(d, { start: wStart, end: wEnd }) || (isBefore(d, wStart) && i === 0);
      });
      if (sessionTasks.length > 0) {
        sessions.push({
          id: `session-${format(wStart, "yyyy-MM-dd")}`,
          label: `Week of ${format(wStart, "MMM d")}`,
          dateRange: { start: format(wStart, "yyyy-MM-dd"), end: format(wEnd, "yyyy-MM-dd") },
          tasks: sessionTasks,
        });
      }
    });
  }

  return sessions;
}

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>(getInitialGardenPlants);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [cadence, setCadence] = useState<MaintenanceCadence>("weekly");
  const [preferredDay, setPreferredDay] = useState<number>(6); // Saturday

  const allTasks = generateTasks(gardenPlants).map((t) => ({
    ...t,
    completed: completedTaskIds.has(t.id),
  }));

  const today = startOfDay(new Date());
  const todayStr = format(today, "yyyy-MM-dd");

  const todayTasks = allTasks.filter((t) => t.dueDate === todayStr && !t.completed);
  const overdueTasks = allTasks.filter(
    (t) => isBefore(new Date(t.dueDate), today) && t.dueDate !== todayStr && !t.completed
  );
  const upcomingTasks = allTasks.filter(
    (t) => !isBefore(new Date(t.dueDate), today) && t.dueDate !== todayStr && !t.completed
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
    setCompletedTaskIds((prev) => new Set(prev).add(taskId));
    setGardenPlants((prev) =>
      prev.map((gp) => {
        if (taskId.startsWith(gp.id)) {
          const todayStr = format(new Date(), "yyyy-MM-dd");
          if (taskId.endsWith("-water")) return { ...gp, lastWatered: todayStr };
          if (taskId.endsWith("-fertilize")) return { ...gp, lastFertilized: todayStr };
          if (taskId.endsWith("-prune")) return { ...gp, lastPruned: todayStr };
        }
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
      {children}
    </GardenContext.Provider>
  );
};
