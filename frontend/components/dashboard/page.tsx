import DayForecast from "./DayForecast";
import React, { useEffect, useState } from "react";
import { weatherApi } from "@/lib/api/weather";
import Map from "./Map";
import WeatherDataListWidget from "./WeatherDataListWidget";
import WikipediaSummary from "./WikipediaSummary";
import ExportButton from "./ExportButton";

interface DashboardProps {
  history: any[];
  isLoading: boolean;
  selectedHistoryId: string | null;
}

const Dashboard = ({
  history,
  isLoading,
  selectedHistoryId,
}: DashboardProps) => {
  const forecast = React.useMemo(() => {
    if (history.length === 0) return null;
    if (selectedHistoryId) {
      const found = history.find((h: any) => h._id === selectedHistoryId);
      return found || history[history.length - 1];
    }
    return history[history.length - 1];
  }, [history, selectedHistoryId]);

  const currentTemp = forecast?.weatherData?.list?.[0]?.main?.temp
    ? Math.round(forecast.weatherData.list[0].main.temp - 273.15)
    : "--";
  const currentCondition =
    forecast?.weatherData?.list?.[0]?.weather?.[0]?.main || "--";

  const todayList = forecast?.weatherData?.list?.slice(0, 8) || [];
  const todayHigh =
    todayList.length > 0
      ? Math.round(
          Math.max(...todayList.map((d: any) => d.main.temp_max)) - 273.15,
        )
      : "--";
  const todayLow =
    todayList.length > 0
      ? Math.round(
          Math.min(...todayList.map((d: any) => d.main.temp_min)) - 273.15,
        )
      : "--";

  // Map coordinates
  const lat =
    forecast?.weatherData?.city?.coord?.lat ||
    forecast?.weatherData?.coord?.lat;
  const lon =
    forecast?.weatherData?.city?.coord?.lon ||
    forecast?.weatherData?.coord?.lon;
  const locationQuery =
    lat && lon ? `${lat},${lon}` : forecast?.resolvedLocationName || "";

  // Current Weather Info
  const currentMain = forecast?.weatherData?.list?.[0]?.main || {};
  const currentWind = forecast?.weatherData?.list?.[0]?.wind || {};
  const currentVis = forecast?.weatherData?.list?.[0]?.visibility;

  // Sunrise / Sunset formatter
  const formatTime = (unixTs?: number) => {
    if (!unixTs) return "--:--";
    return new Date(unixTs * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const widgets = [
    {
      title: "Wind",
      icon: "wind",
      value: currentWind.speed ? `${currentWind.speed} m/s` : "--",
      description: currentWind.gust
        ? `Gusts to ${currentWind.gust}`
        : undefined,
    },
    {
      title: "Humidity",
      icon: "humidity",
      value: currentMain.humidity ? `${currentMain.humidity}%` : "--",
    },
    {
      title: "Feels Like",
      icon: "feels_like",
      value: currentMain.feels_like
        ? `${Math.round(currentMain.feels_like - 273.15)}°`
        : "--",
    },
    {
      title: "Visibility",
      icon: "visibility",
      value: currentVis ? `${(currentVis / 1000).toFixed(1)} km` : "--",
    },
    {
      title: "Pressure",
      icon: "pressure",
      value: currentMain.pressure ? `${currentMain.pressure} hPa` : "--",
    },
    {
      title: "Sunset",
      icon: "sunset",
      value: formatTime(forecast?.weatherData?.city?.sunset),
      description: `Sunrise: ${formatTime(forecast?.weatherData?.city?.sunrise)}`,
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      {forecast && (
        <div className="flex justify-end w-full">
          <ExportButton variant="full" id={forecast._id} />
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <section className="flex flex-col items-center justify-center py-8">
          {isLoading ? (
            <p className="text-slate-400 italic">Loading current weather...</p>
          ) : !forecast ? (
            <>
              <h1 className="text-6xl font-light mb-3 tracking-tight">
                Select a location
              </h1>
              <p className="text-slate-400 text-lg">
                Search for a location to view the current weather and forecast.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-slate-100 text-center px-4">
                {forecast.resolvedLocationName}
              </h1>
              <div className="text-[70px] md:text-[100px] leading-none font-thin tracking-tighter text-slate-50 mt-2 mb-2 ml-4 md:ml-6">
                {currentTemp}°
              </div>
              <h2 className="text-xl md:text-2xl font-medium tracking-wide text-slate-200">
                {currentCondition}
              </h2>
              <div className="flex gap-4 text-lg font-medium text-slate-200 mt-1">
                <span>H:{todayHigh}°</span>
                <span>L:{todayLow}°</span>
              </div>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {widgets.map((widget, i) => (
              <WeatherDataListWidget
                key={i}
                title={widget.title}
                iconCode={widget.icon}
                value={widget.value}
                description={widget.description}
              />
            ))}
          </div>

          <DayForecast forecast={forecast} isLoading={isLoading} />
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <Map locationQuery={locationQuery} />
          </div>

          <div className="lg:col-span-3">
            <WikipediaSummary forecast={forecast} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
