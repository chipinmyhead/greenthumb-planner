import React, { createContext, useContext, useState, useCallback } from "react";
import { GardenPlant, MaintenanceTask } from "@/types/plants";
import { PLANT_DATABASE } from "@/data/plantDatabase";
import { addDays, format, isToday, isBefore, startOfDay } from "date-fns";

interface GardenContextType {
  gardenPlants: GardenPlant[];
  tasks: MaintenanceTask[];
  addPlant: (plantId: string, zone: string) => void;
  removePlant: (gardenPlantId: string) => void;
  completeTask: (taskId: string) => void;
  todayTasks: MaintenanceTask[];
  upcomingTasks: MaintenanceTask[];
  overdueTasks: MaintenanceTask[];
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

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>(getInitialGardenPlants);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

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
    // Also update the last maintenance date on the garden plant
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
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};
