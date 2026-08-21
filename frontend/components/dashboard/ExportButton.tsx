"use client";

import React, { useState, useEffect, useRef } from "react";
import { weatherApi } from "@/lib/api/weather";
import { toast } from "sonner";
import DashboardIcon from "../ui/DashboardIcon";

interface ExportButtonProps {
  id?: string;
  className?: string;
  variant?: "icon" | "full";
}

const ExportButton = ({
  id,
  className = "",
  variant = "icon",
}: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (format: "json" | "csv" | "pdf") => {
    setIsExporting(true);
    setIsOpen(false);
    try {
      const blob = await weatherApi.exportWeather(format, id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `weather_export${id ? `_${id}` : ""}.${format}`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Successfully exported to ${format.toUpperCase()}`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to export to ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={`flex items-center justify-center gap-2 transition-all active:scale-95 ${
          variant === "icon"
            ? "p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700/80 text-slate-300 border border-slate-600/50"
            : "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 font-medium text-sm"
        }`}
        title="Export Data"
      >
        <span className="flex items-center gap-2">
          <div className="w-4 h-4">
            <DashboardIcon iconCode="export" />
          </div>
          {variant === "full" && (
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isExporting ? "Exporting..." : "Export"}
            </h3>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            onClick={() => handleExport("json")}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              <div className="w-6 h-6">
                <DashboardIcon iconCode="dataObject" />
              </div>
              JSON
            </span>
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              <div className="w-6 h-6">
                <DashboardIcon iconCode="tableCSV" />
              </div>
              CSV
            </span>
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              <div className="w-6 h-6">
                <DashboardIcon iconCode="pictureToPDF" />
              </div>
              PDF
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
