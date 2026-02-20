import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GardenProvider } from "@/context/GardenContext";
import { WeatherProvider } from "@/context/WeatherContext";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import GardenPage from "@/pages/GardenPage";
import CalendarPage from "@/pages/CalendarPage";
import PlanPage from "@/pages/PlanPage";
import AddPlantPage from "@/pages/AddPlantPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WeatherProvider>
        <GardenProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/garden" element={<GardenPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/plan" element={<PlanPage />} />
                <Route path="/add" element={<AddPlantPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </div>
          </BrowserRouter>
        </GardenProvider>
      </WeatherProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
