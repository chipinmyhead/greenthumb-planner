import { format, subDays } from "date-fns";

export interface WeatherData {
  currentTemp: number;
  currentCondition: string;
  recentRainMm: number; // total rain in last 3 days
  todayRainMm: number;
  forecastRainMm: number; // expected rain in next 2 days
  lastRainDate: string | null;
  humidity: number;
  isLoading: boolean;
  error: string | null;
}

export const DEFAULT_WEATHER: WeatherData = {
  currentTemp: 0,
  currentCondition: "Unknown",
  recentRainMm: 0,
  todayRainMm: 0,
  forecastRainMm: 0,
  lastRainDate: null,
  humidity: 0,
  isLoading: true,
  error: null,
};

function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 65) return "Rainy";
  if (code <= 67) return "Freezing Rain";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow Showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function getWeatherEmoji(condition: string): string {
  switch (condition) {
    case "Clear": return "☀️";
    case "Partly Cloudy": return "⛅";
    case "Foggy": return "🌫️";
    case "Drizzle": return "🌦️";
    case "Rainy": return "🌧️";
    case "Freezing Rain": return "🌧️";
    case "Snowy": return "❄️";
    case "Showers": return "🌧️";
    case "Snow Showers": return "🌨️";
    case "Thunderstorm": return "⛈️";
    default: return "🌤️";
  }
}

export function getConditionEmoji(condition: string): string {
  return getWeatherEmoji(condition);
}

/** Determines if recent rain is sufficient to skip watering */
export function shouldSuggestSkipWatering(weather: WeatherData): { suggest: boolean; reason: string } {
  const totalRecent = weather.recentRainMm + weather.todayRainMm;

  if (totalRecent >= 10) {
    return { suggest: true, reason: `${totalRecent.toFixed(1)}mm rain in last 3 days — soil likely moist` };
  }
  if (weather.forecastRainMm >= 8) {
    return { suggest: true, reason: `${weather.forecastRainMm.toFixed(1)}mm rain expected soon` };
  }
  if (totalRecent >= 5 && weather.forecastRainMm >= 4) {
    return { suggest: true, reason: `Recent rain (${totalRecent.toFixed(1)}mm) + forecast (${weather.forecastRainMm.toFixed(1)}mm)` };
  }
  return { suggest: false, reason: "" };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const today = new Date();
  const threeDaysAgo = format(subDays(today, 3), "yyyy-MM-dd");
  const todayStr = format(today, "yyyy-MM-dd");

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,weather_code",
    daily: "precipitation_sum",
    past_days: "3",
    forecast_days: "3",
    timezone: "auto",
    temperature_unit: "fahrenheit",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Failed to fetch weather data");

  const data = await res.json();

  const dailyDates: string[] = data.daily.time;
  const dailyPrecip: number[] = data.daily.precipitation_sum;

  // Past 3 days rain (excluding today)
  let recentRainMm = 0;
  let lastRainDate: string | null = null;

  for (let i = 0; i < dailyDates.length; i++) {
    const d = dailyDates[i];
    if (d < todayStr) {
      recentRainMm += dailyPrecip[i] || 0;
      if ((dailyPrecip[i] || 0) > 0.5) lastRainDate = d;
    }
  }

  // Today's rain
  const todayIdx = dailyDates.indexOf(todayStr);
  const todayRainMm = todayIdx >= 0 ? (dailyPrecip[todayIdx] || 0) : 0;
  if (todayRainMm > 0.5) lastRainDate = todayStr;

  // Forecast rain (days after today)
  let forecastRainMm = 0;
  for (let i = 0; i < dailyDates.length; i++) {
    if (dailyDates[i] > todayStr) {
      forecastRainMm += dailyPrecip[i] || 0;
    }
  }

  return {
    currentTemp: Math.round(data.current.temperature_2m),
    currentCondition: getWeatherCondition(data.current.weather_code),
    recentRainMm,
    todayRainMm,
    forecastRainMm,
    lastRainDate,
    humidity: data.current.relative_humidity_2m,
    isLoading: false,
    error: null,
  };
}
