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
        setHistory(response.data || []);
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
    <div className="flex h-screen w-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
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
