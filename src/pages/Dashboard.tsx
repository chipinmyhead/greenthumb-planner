import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import TaskCard from "@/components/TaskCard";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import WeatherTile from "@/components/WeatherTile";
import YardHealthSummary from "@/components/YardHealthSummary";

const Dashboard = () => {
  const { todayTasks, overdueTasks, upcomingTasks, gardenPlants } = useGarden();
  const today = new Date();

  const stats = [
    { label: "Plants", value: gardenPlants.length, icon: "🌱" },
    { label: "Today", value: todayTasks.length, icon: "📋" },
    { label: "Overdue", value: overdueTasks.length, icon: "⚠️" },
  ];

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-sm text-muted-foreground font-medium">
          {format(today, "EEEE, MMMM d")}
        </p>
        <h1 className="text-3xl font-bold text-foreground mt-1">
          Your Garden
        </h1>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl p-4 text-center border border-border"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Yard Health */}
      <YardHealthSummary />

      {/* Overdue tasks */}
      {overdueTasks.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Overdue</h2>
            <span className="ml-auto text-xs font-medium bg-accent/20 text-accent px-2 py-0.5 rounded-full">
              {overdueTasks.length}
            </span>
          </div>
          <div className="space-y-2">
            {overdueTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Today's tasks */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Today's Tasks
        </h2>
        {todayTasks.length > 0 ? (
          <div className="space-y-2">
            {todayTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <span className="text-3xl">🎉</span>
            <p className="text-sm text-muted-foreground mt-2">All caught up for today!</p>
          </div>
        )}
      </motion.section>

      {/* Upcoming */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Coming Up
        </h2>
        {upcomingTasks.length > 0 ? (
          <div className="space-y-2">
            {upcomingTasks.slice(0, 5).map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">No upcoming tasks</p>
          </div>
        )}
      </motion.section>

      {/* Weather tile */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-6"
      >
        <WeatherTile />
      </motion.section>
    </div>
  );
};

export default Dashboard;
