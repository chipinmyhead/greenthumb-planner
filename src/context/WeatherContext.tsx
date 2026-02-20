import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { WeatherData, DEFAULT_WEATHER, fetchWeather } from "@/services/weatherService";

interface WeatherContextType {
  weather: WeatherData;
  refreshWeather: () => void;
  locationError: boolean;
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within WeatherProvider");
  return ctx;
};

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [locationError, setLocationError] = useState(false);

  const load = useCallback(async (lat: number, lon: number) => {
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
    } catch {
      setWeather((prev) => ({ ...prev, isLoading: false, error: "Could not fetch weather" }));
    }
  }, []);

  const refreshWeather = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => load(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Fallback to a default location (New York)
        load(40.71, -74.01);
        setLocationError(true);
      }
    );
  }, [load]);

  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  return (
    <WeatherContext.Provider value={{ weather, refreshWeather, locationError }}>
      {children}
    </WeatherContext.Provider>
  );
};
