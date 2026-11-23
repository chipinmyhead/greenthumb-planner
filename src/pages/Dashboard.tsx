import { Link } from "react-router-dom";
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

  return (
    <div className="px-5 pt-14 pb-28 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
          {format(today, "EEEE, MMMM d")}
        </p>
        <h1 className="text-4xl text-foreground mt-1">
          Your Garden
        </h1>
      </motion.div>

      {gardenPlants.length === 0 && (
        <div className="mb-8 rounded-lg border border-border bg-card p-5">
          <h2 className="text-xl">Add your first plant</h2>
          <p className="my-2 text-sm text-muted-foreground">
            Your garden is saved in this browser.
          </p>
          <Link to="/add" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Browse plants
          </Link>
        </div>
      )}

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 mb-10"
      >
        {[
          { label: "Plants", value: gardenPlants.length },
          { label: "Today", value: todayTasks.length },
          { label: "Overdue", value: overdueTasks.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-1 border-l-2 border-primary/40 pl-3 py-1"
          >
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
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
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <h2 className="text-xl text-foreground">Overdue</h2>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider bg-accent/15 text-accent px-2.5 py-1 rounded-full">
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
        className="mb-8"
      >
        <h2 className="text-xl text-foreground mb-4">
          Today
        </h2>
        {todayTasks.length > 0 ? (
          <div className="space-y-2">
            {todayTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground italic">Nothing due today — enjoy the calm.</p>
          </div>
        )}
      </motion.section>

      {/* Upcoming */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl text-foreground mb-4">
          Coming Up
        </h2>
        {upcomingTasks.length > 0 ? (
          <div className="space-y-2">
            {upcomingTasks.slice(0, 5).map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground italic">No upcoming tasks</p>
          </div>
        )}
      </motion.section>

      {/* Weather tile */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-8"
      >
        <WeatherTile />
      </motion.section>
    </div>
  );
};

export default Dashboard;
