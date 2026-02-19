import { motion } from "framer-motion";
import { TASK_ICONS } from "@/types/plants";
import { MaintenanceTask } from "@/types/plants";
import { useGarden } from "@/context/GardenContext";
import { Check } from "lucide-react";

interface TaskCardProps {
  task: MaintenanceTask;
  index: number;
}

const typeColorClasses: Record<MaintenanceTask["type"], string> = {
  water: "bg-water/15 border-water/30",
  fertilize: "bg-leaf/15 border-leaf/30",
  prune: "bg-earth/15 border-earth/30",
  inspect: "bg-sun/15 border-sun/30",
};

const checkColorClasses: Record<MaintenanceTask["type"], string> = {
  water: "bg-water text-water-foreground",
  fertilize: "bg-leaf text-leaf-foreground",
  prune: "bg-earth text-earth-foreground",
  inspect: "bg-sun text-sun-foreground",
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const { completeTask } = useGarden();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-xl border ${typeColorClasses[task.type]}`}
    >
      <span className="text-2xl">{TASK_ICONS[task.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{task.plantName}</p>
        <p className="text-xs text-muted-foreground capitalize">{task.type}</p>
      </div>
      <button
        onClick={() => completeTask(task.id)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${checkColorClasses[task.type]}`}
      >
        <Check className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default TaskCard;
