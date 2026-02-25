import { NavLink, useLocation } from "react-router-dom";
import { Home, Flower2, Calendar, ClipboardList, Plus, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/garden", icon: Flower2, label: "Garden" },
  { to: "/plan", icon: ClipboardList, label: "Plan" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/add", icon: Plus, label: "Add" },
  { to: "/learn", icon: BookOpen, label: "Learn" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-[1px] left-3 right-3 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                className={`w-[18px] h-[18px] transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span
                className={`text-[9px] uppercase tracking-[0.08em] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;
