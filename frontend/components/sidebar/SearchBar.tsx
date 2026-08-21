"use client";

import React, { useState, useEffect } from "react";
import { weatherApi } from "../../lib/api/weather";
import { toast } from "sonner";

interface SearchBarProps {
  onSearchSuccess: (editedId?: string) => void;
  editingRecord?: any;
  onCancelEdit?: () => void;
}

const SearchBar = ({
  onSearchSuccess,
  editingRecord,
  onCancelEdit,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [days, setDays] = useState("5");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      setQuery(editingRecord.searchQuery);
      setDays(editingRecord.days?.toString() || "5");
    } else {
      setQuery("");
      setDays("5");
    }
  }, [editingRecord]);

  const handleSearch = async () => {
    if (!query) {
      toast.warning("Please enter a location!");
      return;
    }

    const numDays = Number(days);
    if (numDays > 5) {
      toast.error("Maximum forecast is 5 days on the free tier.");
      setDays("5");
      return;
    }

    setIsLoading(true);

    try {
      let type = "city";

      if (query.includes(",")) type = "coordinates";
      else if (/^\d+$/.test(query)) type = "zipCode";

      if (editingRecord) {
        await weatherApi.updateWeatherRecord(
          editingRecord._id,
          type,
          query,
          Number(days),
        );
        toast.success("Weather Data updated!");
        if (onCancelEdit) onCancelEdit();
        onSearchSuccess(editingRecord._id);
      } else {
        await weatherApi.searchWeather(type, query, Number(days));
        toast.success("Weather Data found!");
        setQuery("");
        onSearchSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city, zip, or lat,lon..."
        className="w-full px-4 py-3 rounded-xl bg-slate-700/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 border border-slate-600/50 transition-all"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <div className="flex gap-2">
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="Days"
          min="1"
          max="5"
          className="w-full px-4 py-3 rounded-xl bg-slate-700/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 border border-slate-600/50 transition-all"
        />
        {editingRecord && (
          <button
            onClick={onCancelEdit}
            disabled={isLoading}
            className="px-5 py-3 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-colors shadow-lg"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap"
        >
          {isLoading ? "..." : editingRecord ? "Update" : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
