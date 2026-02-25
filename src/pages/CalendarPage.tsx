import { useState } from "react";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TASK_ICONS, MaintenanceTask } from "@/types/plants";

const CalendarPage = () => {
  const { tasks } = useGarden();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const tasksByDate = tasks.reduce<Record<string, MaintenanceTask[]>>((acc, task) => {
    if (!acc[task.dueDate]) acc[task.dueDate] = [];
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedTasks = selectedDateStr ? (tasksByDate[selectedDateStr] || []) : [];

  const dotColor: Record<MaintenanceTask["type"], string> = {
    water: "bg-water",
    fertilize: "bg-leaf",
    prune: "bg-earth",
    inspect: "bg-sun",
  };

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
      </motion.div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-muted">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-muted">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-7 gap-1"
      >
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate[dateStr] || [];
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const uniqueTypes = [...new Set(dayTasks.map((t) => t.type))];

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-all
                ${isSelected ? "bg-primary text-primary-foreground" : ""}
                ${isToday && !isSelected ? "ring-1 ring-primary/40" : ""}
                ${!isSelected ? "hover:bg-muted" : ""}
              `}
            >
              <span className="font-medium">{format(day, "d")}</span>
              {uniqueTypes.length > 0 && (
                <div className="flex gap-0.5">
                  {uniqueTypes.slice(0, 3).map((type) => (
                    <span key={type} className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary-foreground/70" : dotColor[type]}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Selected date tasks */}
      {selectedDate && (
        <motion.div
          key={selectedDateStr}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {format(selectedDate, "EEEE, MMM d")}
          </h3>
          {selectedTasks.length > 0 ? (
            <div className="space-y-2">
              {selectedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border border-border bg-card ${task.completed ? "opacity-50" : ""}`}
                >
                  <span className="text-xl">{TASK_ICONS[task.type]}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{task.plantName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{task.type}{task.completed ? " · Done" : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">No tasks on this day</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CalendarPage;
