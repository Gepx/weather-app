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
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (history.length === 0) {
        setIsLoading(true);
      }
      try {
        const response = await weatherApi.getWeatherHistory();
        const historyData = response.data || [];
        const savedLocId = localStorage.getItem("currentLocationId");

        const locationExistsInHistory = historyData.some(
          (r: any) => r._id === savedLocId,
        );

        const sortHistory = (data: any[], topId: string | null) => {
          return [...data].sort((a, b) => {
            if (a._id === topId) return -1;
            if (b._id === topId) return 1;
            return 0;
          });
        };

        if (
          (!savedLocId || !locationExistsInHistory) &&
          navigator.geolocation
        ) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const newRecord = await weatherApi.searchWeather(
                  "coordinates",
                  `${latitude},${longitude}`,
                  5,
                );

                if (newRecord?.data?._id) {
                  const newId = newRecord.data._id;
                  localStorage.setItem("currentLocationId", newId);
                  setCurrentLocationId(newId);

                  const newDataResponse = await weatherApi.getWeatherHistory();
                  setHistory(sortHistory(newDataResponse.data || [], newId));
                }
              } catch (err) {
                console.error("Failed to fetch current location", err);
              }
            },
            (err) => console.error("Geolocation error:", err),
          );
        } else {
          setCurrentLocationId(savedLocId);
          setHistory(sortHistory(historyData, savedLocId));
        }
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
    setIsSidebarOpen(false);
    if (editedId) {
      setSelectedHistoryId(editedId);
    } else {
      setSelectedHistoryId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-slate-900 text-slate-100 overflow-hidden font-sans relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur border-b border-slate-700/50 z-30">
        <span className="font-bold text-lg tracking-wide text-slate-100">
          Weather
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 px-4 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl font-medium text-sm transition-active active:scale-95"
        >
          {isSidebarOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div
        className={`${
          isSidebarOpen ? "flex" : "hidden"
        } md:flex absolute md:relative z-40 h-[calc(100dvh-65px)] md:h-full w-full md:w-auto bg-slate-900 md:bg-transparent top-[65px] md:top-0`}
      >
        <Sidebar
          onSearchSuccess={handleSearchSuccess}
          history={history}
          isLoading={isLoading}
          selectedHistoryId={selectedHistoryId}
          onHistorySelect={(id) => {
            setSelectedHistoryId(id);
            setIsSidebarOpen(false);
          }}
          currentLocationId={currentLocationId}
        />
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Dashboard
          history={history}
          isLoading={isLoading}
          selectedHistoryId={selectedHistoryId}
        />
      </main>
    </div>
  );
}
