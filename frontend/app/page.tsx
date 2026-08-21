"use client";

import Dashboard from "@/components/dashboard/page";
import Sidebar from "@/components/sidebar/page";
import React, { useState, useEffect } from "react";
import { weatherApi } from "@/lib/api/weather";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null,
  );
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (history.length === 0) {
        setIsLoading(true);
      }
      try {
        const response = await weatherApi.getWeatherHistory();
        const historyData = response.data || [];
        const sortHistory = (data: any[]) => {
          return [...data].sort((a, b) => {
            if (a.isCurrentLocation) return -1;
            if (b.isCurrentLocation) return 1;
            return 0;
          });
        };

        const hasCurrentLocation = historyData.some(
          (r: any) => r.isCurrentLocation,
        );
        if (!hasCurrentLocation && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                await weatherApi.searchWeather(
                  "coordinates",
                  `${latitude},${longitude}`,
                  5,
                  true,
                );
                const newDataResponse = await weatherApi.getWeatherHistory();
                setHistory(sortHistory(newDataResponse.data || []));
              } catch (err) {
                console.error("Failed to fetch current location", err);
              }
            },
            (err) => console.error("Geolocation error:", err),
          );
        }

        setHistory(sortHistory(historyData));
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [refreshKey]);

  const handleSearchSuccess = (editedId?: string) => {
    setRefreshKey((prev) => prev + 1);
    if (editedId) {
      setSelectedHistoryId(editedId);
    } else {
      setSelectedHistoryId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      <Sidebar
        onSearchSuccess={handleSearchSuccess}
        history={history}
        isLoading={isLoading}
        selectedHistoryId={selectedHistoryId}
        onHistorySelect={setSelectedHistoryId}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <Dashboard
          history={history}
          isLoading={isLoading}
          selectedHistoryId={selectedHistoryId}
        />
      </main>
    </div>
  );
}
