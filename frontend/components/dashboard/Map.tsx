import React from "react";

const Map = ({ locationQuery }: { locationQuery: string }) => {
  return (
    <>
      <div className="w-full h-full min-h-[16rem] bg-slate-800/40 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center shadow-xl overflow-hidden relative group">
        {locationQuery ? (
          <>
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=10&output=embed`}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{
                border: 0,
                filter: "invert(90%) hue-rotate(180deg) contrast(85%)",
              }}
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-4xl text-slate-500 mb-2">
              map
            </span>
            <span className="text-slate-500 font-medium">
              Select a location to view map
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default Map;
