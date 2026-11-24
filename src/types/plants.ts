export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category?: PlantCategory;
  image: string;
  waterFrequencyDays?: number;
  fertilizerFrequencyDays?: number;
  pruneFrequencyDays?: number;
  sunlight?: "full" | "partial" | "shade";
  waterNeeds?: "low" | "medium" | "high";
  hardiness?: string;
  fertilizerType?: string;
  notes?: string;
  observationCount?: number;
  verifiedCare?: { guidance: string; sources: readonly string[] };
}

export type PlantCategory = "shrub" | "tree" | "flower" | "grass" | "succulent" | "herb" | "vine";

export interface GardenPlant {
  id: string;
  plant: Plant;
  addedDate: string;
  zone: string;
  lastWatered?: string;
  lastFertilized?: string;
  lastPruned?: string;
}

export interface MaintenanceTask {
  id: string;
  gardenPlantId: string;
  plantName: string;
  type: "water" | "fertilize" | "prune" | "inspect";
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

export const TASK_COLORS: Record<MaintenanceTask["type"], string> = {
  water: "water",
  fertilize: "leaf",
  prune: "earth",
  inspect: "sun",
};

export const TASK_ICONS: Record<MaintenanceTask["type"], string> = {
  water: "💧",
  fertilize: "🌿",
  prune: "✂️",
  inspect: "🔍",
};

export const CATEGORY_ICONS: Record<PlantCategory, string> = {
  shrub: "🌳",
  tree: "🌲",
  flower: "🌸",
  grass: "🌾",
  succulent: "🌵",
  herb: "🌿",
  vine: "🍇",
};

export type MaintenanceCadence = "weekly" | "biweekly" | "monthly";

export interface MaintenanceSession {
  id: string;
  label: string;
  dateRange: { start: string; end: string };
  plannedDate?: string;
  tasks: MaintenanceTask[];
}
