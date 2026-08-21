import React from "react";
import DashboardIcon from "../ui/DashboardIcon";

const WikipediaSummary = ({ forecast }: { forecast: any }) => {
  return (
    <>
      <div className="bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50 shadow-xl flex flex-col">
        <h3 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <div className="w-4 h-4">
            <DashboardIcon iconCode="wikipedia" />
          </div>
          Wikipedia Summary
        </h3>
        <p className="text-slate-300 leading-relaxed text-sm">
          {forecast?.locationDescription || "No summary available yet."}
        </p>
      </div>
    </>
  );
};

export default WikipediaSummary;
