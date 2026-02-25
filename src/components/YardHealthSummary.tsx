import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { useMemo } from "react";

interface HealthGrade {
  label: string;
  emoji: string;
  color: string;
  message: string;
}

function getHealthGrade(
  overdueCount: number,
  todayCount: number,
  completedCount: number,
  totalTasks: number,
  gardenSize: number
): HealthGrade {
  if (gardenSize === 0) {
    return {
      label: "Getting Started",
      emoji: "🌱",
      color: "text-muted-foreground",
      message: "Add some plants to your garden and we'll track how well you're keeping up!",
    };
  }

  if (totalTasks === 0) {
    return {
      label: "All Clear",
      emoji: "✨",
      color: "text-primary",
      message: "No tasks on the horizon — your garden is in great shape.",
    };
  }

  const overdueRatio = overdueCount / Math.max(totalTasks, 1);
  const activeIncomplete = overdueCount + todayCount;

  if (overdueCount === 0 && todayCount === 0) {
    return {
      label: "Excellent",
      emoji: "🏆",
      color: "text-primary",
      message: "You're completely caught up! Every plant is getting the attention it needs. Keep this momentum going.",
    };
  }

  if (overdueCount === 0) {
    return {
      label: "Excellent",
      emoji: "🌟",
      color: "text-primary",
      message: "No overdue tasks — you're right on schedule. Knock out today's tasks and your yard will thank you.",
    };
  }

  if (overdueRatio < 0.2) {
    return {
      label: "Good",
      emoji: "👍",
      color: "text-leaf",
      message: `Just ${overdueCount} overdue task${overdueCount > 1 ? "s" : ""} — you're nearly there. A quick catch-up session will get you back to perfect.`,
    };
  }

  if (overdueRatio < 0.5) {
    return {
      label: "Fair",
      emoji: "🌤️",
      color: "text-sun",
      message: `You have ${overdueCount} overdue task${overdueCount > 1 ? "s" : ""} piling up. Focus on watering first — it's the most time-sensitive — then tackle the rest.`,
    };
  }

  if (overdueRatio < 0.8) {
    return {
      label: "Needs Attention",
      emoji: "⚠️",
      color: "text-accent",
      message: `${overdueCount} tasks are overdue. Your plants may be stressed — prioritize watering and check for wilting. A 15-minute session can make a big difference.`,
    };
  }

  return {
    label: "Needs a Lot of Work",
    emoji: "🚨",
    color: "text-destructive",
    message: `${overdueCount} tasks need urgent attention. Start with the most drought-sensitive plants and work through the overdue list. Even partial catch-up helps!`,
  };
}

const YardHealthSummary = () => {
  const { overdueTasks, todayTasks, tasks, gardenPlants } = useGarden();

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  const grade = useMemo(
    () =>
      getHealthGrade(
        overdueTasks.length,
        todayTasks.length,
        completedCount,
        totalTasks,
        gardenPlants.length
      ),
    [overdueTasks.length, todayTasks.length, completedCount, totalTasks, gardenPlants.length]
  );

  // Progress bar: proportion of tasks that are NOT overdue
  const healthPercent =
    totalTasks > 0
      ? Math.round(((totalTasks - overdueTasks.length) / totalTasks) * 100)
      : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="bg-card rounded-xl border border-border p-4 mb-8"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{grade.emoji}</span>
          <h3 className={`font-semibold text-sm ${grade.color}`}>{grade.label}</h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{healthPercent}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${healthPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${
            healthPercent >= 80
              ? "bg-primary"
              : healthPercent >= 50
                ? "bg-sun"
                : "bg-accent"
          }`}
        />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{grade.message}</p>
    </motion.div>
  );
};

export default YardHealthSummary;
