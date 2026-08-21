"use client";
import React from "react";
import WeatherIcon from "../ui/WeatherIcon";
import DashboardIcon from "../ui/DashboardIcon";

const processForecastData = (list: any[], maxDays: number) => {
  if (!list || !Array.isArray(list)) return [];
  const dailyData: Record<string, any> = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        pop: item.pop || 0,
        weather: item.weather[0],
      };
    } else {
      dailyData[date].minTemp = Math.min(
        dailyData[date].minTemp,
        item.main.temp_min,
      );
      dailyData[date].maxTemp = Math.max(
        dailyData[date].maxTemp,
        item.main.temp_max,
      );
      dailyData[date].pop = Math.max(dailyData[date].pop, item.pop || 0);
      if (
        item.weather[0].icon.endsWith("d") &&
        !dailyData[date].weather.icon.endsWith("d")
      ) {
        dailyData[date].weather = item.weather[0];
      }
    }
  });

  return Object.values(dailyData).slice(0, maxDays);
};

interface DayForecastProps {
  forecast: any;
  isLoading: boolean;
}

const DayForecast = ({ forecast, isLoading }: DayForecastProps) => {
  const processedDays = React.useMemo(() => {
    if (!forecast || !forecast.weatherData?.list) return [];
    return processForecastData(forecast.weatherData.list, forecast.days || 5);
  }, [forecast]);

  const minWeeklyTemp = Math.min(...processedDays.map((d: any) => d.minTemp));
  const maxWeeklyTemp = Math.max(...processedDays.map((d: any) => d.maxTemp));

  return (
    <div className="lg:col-span-1 bg-slate-800 rounded-3xl p-6 border border-slate-700/50 shadow-xl flex flex-col h-full">
      <h3 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
        <div className="w-4 h-4">
          <DashboardIcon iconCode="calendar" />
        </div>
        {forecast?.days || 5}-DAY FORECAST
      </h3>

      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500 italic py-4">
            Loading forecast...
          </div>
        ) : !forecast ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500 italic py-4">
            Search a location to view the forecast.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-700/50">
            {processedDays.map((day: any, index: number) => {
              const leftPercent =
                ((day.minTemp - minWeeklyTemp) /
                  (maxWeeklyTemp - minWeeklyTemp)) *
                100;
              const widthPercent =
                ((day.maxTemp - day.minTemp) /
                  (maxWeeklyTemp - minWeeklyTemp)) *
                100;

              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between py-3"
                >
                  {/* Day Name */}
                  <span className="w-12 text-lg font-medium text-slate-200">
                    {index === 0
                      ? "Today"
                      : new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                  </span>

                  {/* Icon & Precipitation */}
                  <div className="w-12 flex flex-col items-center justify-center">
                    <div className="w-6 h-6 text-slate-200">
                      <WeatherIcon iconCode={day.weather.icon} />
                    </div>
                    {day.pop > 0 && (
                      <span className="text-[10px] font-bold text-cyan-400 mt-0.5">
                        {Math.round(day.pop * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Min Temp */}
                  <span className="w-8 text-right text-lg font-light text-slate-400">
                    {Math.round(day.minTemp - 273.15)}°
                  </span>

                  {/* Temperature Range Bar */}
                  <div className="flex-1 mx-4 h-1.5 bg-slate-700/50 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-teal-400 to-orange-400 rounded-full"
                      style={{
                        left: `${Math.max(0, leftPercent)}%`,
                        width: `${Math.max(2, widthPercent)}%`,
                      }}
                    >
                      {index === 0 && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-1 w-1 h-1 bg-white rounded-full shadow-sm" />
                      )}
                    </div>
                  </div>

                  {/* Max Temp */}
                  <span className="w-8 text-right text-lg font-medium text-slate-100">
                    {Math.round(day.maxTemp - 273.15)}°
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayForecast;
