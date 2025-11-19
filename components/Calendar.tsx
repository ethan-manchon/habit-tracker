"use client";
import React, { useState } from "react";

const days = ["L", "M", "M", "J", "V", "S", "D"];

export default function Calendar() {
  const [selected, setSelected] = useState<number>(3);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900/60 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-yellow-400">🔥</div>
          <div className="text-sm text-gray-300">Série actuelle</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full">5 jours</div>
          <button className="text-gray-400">⤢</button>
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-400 text-sm mb-3">
        <button className="px-2">‹</button>
        <div>10 nov. - 16 nov.</div>
        <button className="px-2">›</button>
      </div>

      <div className="flex items-center justify-between mb-3">
        {days.map((d, i) => (
          <div key={i} className="text-center text-xs text-gray-400 w-8">{d}</div>
        ))}
      </div>

      <div className="flex gap-2">
        {[10, 11, 12, 13, 14, 15, 16].map((date, i) => {
          const sel = i === selected;
          return (
            <button
              key={date}
              onClick={() => setSelected(i)}
              className={`w-10 h-10 rounded-lg ${sel ? "bg-indigo-700 text-white ring-2 ring-indigo-500" : "bg-gray-800 text-gray-400"}`}
            >
              {date}
            </button>
          );
        })}
      </div>
    </div>
  );
}
