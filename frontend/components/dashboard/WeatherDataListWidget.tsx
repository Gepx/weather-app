import React from "react";
import WidgetIcon from "../ui/WidgetIcon";

interface WeatherDataListWidgetProps {
  title: string;
  iconCode: string;
  value: React.ReactNode;
  description?: string;
}

const WeatherDataListWidget = ({
  title,
  iconCode,
  value,
  description,
}: WeatherDataListWidgetProps) => {
  return (
    <div className="bg-slate-800/40 rounded-3xl p-4 md:p-5 border border-slate-700/50 shadow-xl flex flex-col h-full min-h-[140px]">
      <h3 className="text-[10px] md:text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
        <div className="w-3 h-3 md:w-4 md:h-4">
          <WidgetIcon iconCode={iconCode} />
        </div>
        {title}
      </h3>

      <div className="flex flex-col flex-1 mt-2">
        <span className="text-xl md:text-2xl font-light text-slate-200">
          {value}
        </span>
        {description && (
          <span className="text-xs md:text-sm text-slate-400 mt-auto font-medium truncate text-left">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};

export default WeatherDataListWidget;
