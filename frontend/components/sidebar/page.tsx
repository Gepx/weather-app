"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { weatherApi } from "@/lib/api/weather";
import { toast } from "sonner";
import ExportButton from "../dashboard/ExportButton";
import DashboardIcon from "../ui/DashboardIcon";
import WeatherIcon from "../ui/WeatherIcon";

interface SidebarProps {
  onSearchSuccess: (editedId?: string) => void;
  history: any[];
  isLoading: boolean;
  selectedHistoryId: string | null;
  onHistorySelect: (id: string) => void;
}

const Sidebar = ({
  onSearchSuccess,
  history,
  isLoading,
  selectedHistoryId,
  onHistorySelect,
}: SidebarProps) => {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    try {
      await weatherApi.deleteWeatherRecord(id);
      toast.success("Record deleted successfully");
      if (selectedHistoryId === id) {
        onSearchSuccess();
      } else {
        onSearchSuccess(selectedHistoryId || undefined);
      }
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const handleEdit = (record: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    setEditingRecord(record);
    onHistorySelect(record._id);
  };

  const handleSearchSuccessWrapper = (editedId?: string) => {
    setEditingRecord(null);
    onSearchSuccess(editedId);
  };

  const handleHistorySelect = (id: string) => {
    if (editingRecord && editingRecord._id !== id) {
      setEditingRecord(null);
    }
    onHistorySelect(id);
  };

  return (
    <aside className="w-full md:w-80 h-full flex-shrink-0 border-r border-slate-700/50 bg-slate-800/40 p-5 flex flex-col gap-6">
      <SearchBar
        onSearchSuccess={handleSearchSuccessWrapper}
        editingRecord={editingRecord}
        onCancelEdit={() => setEditingRecord(null)}
      />

      <div className="flex-1 mt-2 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Recent Searches
          </h3>
          <ExportButton variant="icon" />
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1 pb-4">
          {isLoading ? (
            <div className="text-sm text-slate-500 italic px-2">
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="text-sm text-slate-500 italic px-2">
              No recent searches.
            </div>
          ) : (
            history.map((record) => {
              const todayList = record.weatherData?.list?.slice(0, 8) || [];
              const todayHigh =
                todayList.length > 0
                  ? Math.round(
                      Math.max(...todayList.map((d: any) => d.main.temp_max)) -
                        273.15,
                    )
                  : "--";
              const todayLow =
                todayList.length > 0
                  ? Math.round(
                      Math.min(...todayList.map((d: any) => d.main.temp_min)) -
                        273.15,
                    )
                  : "--";

              return (
                <div
                  key={record._id}
                  onClick={() => handleHistorySelect(record._id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setActiveDropdownId(
                      activeDropdownId === record._id ? null : record._id,
                    );
                  }}
                  className={`p-4 rounded-2xl border transition-all active:scale-[0.98] group relative ${selectedHistoryId === record._id ? "border-blue-500 bg-slate-700/50" : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 cursor-pointer"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-semibold text-slate-200 group-hover:text-white transition-colors truncate pr-2 flex items-center gap-1">
                      {record.isCurrentLocation && (
                        <span
                          title="Current Location"
                          className="text-blue-400"
                        >
                          📍
                        </span>
                      )}
                      {record.resolvedLocationName}
                    </span>

                    <div className="flex flex-col items-end relative">
                      <span className="text-3xl font-light shrink-0">
                        {record.weatherData?.list?.[0]?.main?.temp
                          ? Math.round(
                              record.weatherData.list[0].main.temp - 273.15,
                            )
                          : "--"}
                        °
                      </span>

                      {activeDropdownId === record._id && (
                        <div
                          className="absolute top-8 right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 w-28 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onMouseDown={(e) => handleEdit(record, e)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                          >
                            <span className="flex items-center gap-2">
                              <div className="w-6 h-6">
                                <DashboardIcon iconCode="edit" />
                              </div>
                              Edit
                            </span>
                          </button>
                          {!record.isCurrentLocation && (
                            <button
                              onMouseDown={(e) => handleDelete(record._id, e)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
                            >
                              <span className="flex items-center gap-2">
                                <div className="w-6 h-6">
                                  <DashboardIcon iconCode="delete" />
                                </div>
                                Delete
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 flex items-center gap-1 capitalize">
                      <span style={{ fontSize: "14px" }}>
                        {record.weatherData?.list?.[0]?.weather?.[0]
                          ?.description || "Unknown"}
                      </span>
                    </span>
                    <div className="flex gap-4 text-xs font-xs text-slate-200 mt-1">
                      <span>H:{todayHigh}°</span>
                      <span>L:{todayLow}°</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-auto shrink-0 pt-6 border-t border-slate-700/50 flex flex-col gap-2 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">
          Built by <span className="text-blue-400">Egip Sinargo</span>
        </p>
        <p className="leading-relaxed">
          PM Accelerator is a US based company with a global reach premiering in
          AI learning and as a development hub, featuring award-winning AI
          products and mentors from top-tier companies such as Google, Meta,
          Apple, and Nvidia.
        </p>
        <p className="leading-relaxed">
          They offer a dynamic AI PM Bootcamp, designed to empower the next
          generation of AI professionals through hands-on experience,
          mentorship, and real-world projects.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
