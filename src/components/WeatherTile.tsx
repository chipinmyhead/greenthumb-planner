import { motion } from "framer-motion";
import { useWeather } from "@/context/WeatherContext";
import { getConditionEmoji, shouldSuggestSkipWatering } from "@/services/weatherService";
import { CloudRain, Droplets, RefreshCw, Thermometer } from "lucide-react";
import { format } from "date-fns";

const WeatherTile = () => {
  const { weather, refreshWeather, locationError } = useWeather();

  if (weather.isLoading) {
    return (
      <div className="bg-card rounded-md border border-border p-5 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-3" />
        <div className="h-8 bg-muted rounded w-1/2" />
      </div>
    );
  }

  if (weather.error) {
    return (
      <div className="bg-card rounded-md border border-border p-5 text-center">
        <p className="text-sm text-muted-foreground">{weather.error}</p>
        <button onClick={refreshWeather} className="text-xs text-primary mt-2 flex items-center gap-1 mx-auto">
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  const skipSuggestion = shouldSuggestSkipWatering(weather);
  const totalRecent = weather.recentRainMm + weather.todayRainMm;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-card rounded-md border border-border p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl text-foreground">Weather</h2>
        <button onClick={refreshWeather} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Current conditions */}
      <div className="flex items-center gap-4 mb-5">
        <span className="text-5xl">{getConditionEmoji(weather.currentCondition)}</span>
        <div>
          <p className="text-3xl font-semibold text-foreground" style={{ fontFamily: "'DM Serif Display', serif" }}>{weather.currentTemp}°F</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{weather.currentCondition}</p>
        </div>
      </div>

      {/* Rain stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="border border-border rounded-md p-2.5 text-center">
          <Droplets className="w-3.5 h-3.5 text-water mx-auto mb-1" />
          <p className="text-sm font-semibold text-foreground">{totalRecent.toFixed(1)}<span className="text-[10px] font-normal text-muted-foreground">mm</span></p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">3-day rain</p>
        </div>
        <div className="border border-border rounded-md p-2.5 text-center">
          <CloudRain className="w-3.5 h-3.5 text-water mx-auto mb-1" />
          <p className="text-sm font-semibold text-foreground">{weather.forecastRainMm.toFixed(1)}<span className="text-[10px] font-normal text-muted-foreground">mm</span></p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Forecast</p>
        </div>
        <div className="border border-border rounded-md p-2.5 text-center">
          <Thermometer className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
          <p className="text-sm font-semibold text-foreground">{weather.humidity}<span className="text-[10px] font-normal text-muted-foreground">%</span></p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Humidity</p>
        </div>
      </div>

      {weather.lastRainDate && (
        <p className="text-[11px] text-muted-foreground mb-2">
          Last rain: {format(new Date(weather.lastRainDate), "MMM d")}
        </p>
      )}

      {skipSuggestion.suggest && (
        <div className="border border-water/20 rounded-md p-3 mt-2">
          <p className="text-xs font-medium text-water">💧 Consider skipping watering</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{skipSuggestion.reason}</p>
        </div>
      )}

      {locationError && (
        <p className="text-[10px] text-muted-foreground mt-2 italic">Using default location — enable GPS for local weather</p>
      )}
    </motion.div>
  );
};

export default WeatherTile;
