import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { MaintenanceCadence, MaintenanceSession, TASK_ICONS } from "@/types/plants";
import { Check, ChevronDown, Settings2 } from "lucide-react";

const CADENCE_OPTIONS: { value: MaintenanceCadence; label: string; desc: string }[] = [
  { value: "weekly", label: "Weekly", desc: "Tasks grouped by week" },
  { value: "biweekly", label: "Biweekly", desc: "Every two weeks" },
  { value: "monthly", label: "Monthly", desc: "Tasks grouped by month" },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PlanPage = () => {
  const { cadence, setCadence, maintenanceSessions, preferredDay, setPreferredDay, completeTask } = useGarden();
  const [showSettings, setShowSettings] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(
    maintenanceSessions[0]?.id ?? null
  );

  const totalTasks = maintenanceSessions.reduce((sum, s) => sum + s.tasks.length, 0);

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Plan</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
          >
            <Settings2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          {totalTasks} tasks across {maintenanceSessions.length} sessions
        </p>
      </motion.div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-2xl bg-card border border-border space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Cadence</p>
                <div className="grid grid-cols-3 gap-2">
                  {CADENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCadence(opt.value)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        cadence === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className={`text-[10px] mt-0.5 ${
                        cadence === opt.value ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {cadence !== "monthly" && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Preferred Day</p>
                  <div className="flex gap-1.5">
                    {DAY_NAMES.map((name, i) => (
                      <button
                        key={i}
                        onClick={() => setPreferredDay(i)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          preferredDay === i
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sessions */}
      <div className="mt-6 space-y-3">
        {maintenanceSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-8 text-center"
          >
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-sm text-muted-foreground">All caught up! No upcoming tasks.</p>
          </motion.div>
        ) : (
          maintenanceSessions.map((session, i) => (
            <SessionCard
              key={session.id}
              session={session}
              index={i}
              expanded={expandedSession === session.id}
              onToggle={() =>
                setExpandedSession(expandedSession === session.id ? null : session.id)
              }
              onCompleteTask={completeTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

function SessionCard({
  session,
  index,
  expanded,
  onToggle,
  onCompleteTask,
}: {
  session: MaintenanceSession;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onCompleteTask: (id: string) => void;
}) {
  const completedCount = session.tasks.filter((t) => t.completed).length;
  const totalCount = session.tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Group tasks by type for smart display
  const tasksByType = session.tasks.reduce<Record<string, typeof session.tasks>>((acc, t) => {
    if (!acc[t.type]) acc[t.type] = [];
    acc[t.type].push(t);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{session.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalCount} task{totalCount !== 1 ? "s" : ""} · {completedCount} done
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground ml-3 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {Object.entries(tasksByType).map(([type, tasks]) => (
                <div key={type}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <span>{TASK_ICONS[type as keyof typeof TASK_ICONS]}</span>
                    {type} ({tasks.length})
                  </p>
                  <div className="space-y-1.5">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                          task.completed ? "opacity-40" : "bg-muted/50"
                        }`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!task.completed) onCompleteTask(task.id);
                          }}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/30 hover:border-primary"
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                        </button>
                        <span className={`text-sm flex-1 ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.plantName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{task.dueDate.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PlanPage;
