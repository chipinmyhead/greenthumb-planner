import { motion } from "framer-motion";
import { TASK_ICONS } from "@/types/plants";
import { MaintenanceTask } from "@/types/plants";
import { useGarden } from "@/context/GardenContext";
import { useWeather } from "@/context/WeatherContext";
import { shouldSuggestSkipWatering } from "@/services/weatherService";
import { Check, CloudRain } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: MaintenanceTask;
  index: number;
}

const typeAccents: Record<MaintenanceTask["type"], string> = {
  water: "border-l-water",
  fertilize: "border-l-leaf",
  prune: "border-l-earth",
  inspect: "border-l-sun",
};

const checkAccents: Record<MaintenanceTask["type"], string> = {
  water: "bg-water text-water-foreground",
  fertilize: "bg-leaf text-leaf-foreground",
  prune: "bg-earth text-earth-foreground",
  inspect: "bg-sun text-sun-foreground",
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const { completeTask } = useGarden();
  const { weather } = useWeather();
  const [dismissed, setDismissed] = useState(false);

  const isWaterTask = task.type === "water";
  const rainSuggestion = isWaterTask && !weather.isLoading ? shouldSuggestSkipWatering(weather) : null;
  const showSuggestion = rainSuggestion?.suggest && !dismissed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="space-y-0"
    >
      <div className={`flex items-center gap-3 p-3 bg-card border border-border border-l-[3px] ${typeAccents[task.type]} ${showSuggestion ? "rounded-t-md rounded-b-none" : "rounded-md"}`}>
        <span className="text-xl">{TASK_ICONS[task.type]}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{task.plantName}</p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{task.type}</p>
        </div>
        <button
          onClick={() => completeTask(task.id)}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 ${checkAccents[task.type]}`}
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>

      {showSuggestion && (
        <div className="flex items-center gap-2 px-3 py-2 bg-water/8 border border-t-0 border-water/15 rounded-b-md">
          <CloudRain className="w-3.5 h-3.5 text-water shrink-0" />
          <p className="text-[11px] text-muted-foreground flex-1">{rainSuggestion!.reason}</p>
          <button
            onClick={() => setDismissed(true)}
            className="text-[10px] text-muted-foreground hover:text-foreground shrink-0 uppercase tracking-wider"
          >
            Dismiss
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
