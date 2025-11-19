"use client";
import React, { useEffect, useState } from "react";

const days = ["L", "M", "M", "J", "V", "S", "D"];

type Props = {
  selectedDate?: Date;
  onSelectDate?: (d: Date) => void;
};

function startOfWeek(date: Date) {
  // return Monday as start
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 = Sun
  const diff = (day + 6) % 7; // Monday=0
  d.setDate(d.getDate() - diff);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function Calendar({ selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(selectedDate ?? todayStart));
  const [selected, setSelected] = useState<Date>(selectedDate ?? todayStart);

  useEffect(() => {
    if (selectedDate) {
      setSelected(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
      setWeekStart(startOfWeek(selectedDate));
    }
  }, [selectedDate]);

  const prevWeek = () => {
    const s = new Date(weekStart);
    s.setDate(s.getDate() - 7);
    setWeekStart(s);
  };

  const nextWeek = () => {
    const s = new Date(weekStart);
    s.setDate(s.getDate() + 7);
    // compute start of current week for today
    const currentWeek = startOfWeek(todayStart);
    // prevent going into future (weekStart cannot be after currentWeek)
    if (s.getTime() > currentWeek.getTime()) return;
    setWeekStart(s);
  };

  const daysInWeek = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const rangeLabel = (() => {
    const start = daysInWeek[0];
    const end = daysInWeek[6];
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    return `${start.toLocaleDateString("fr-FR", opts)} - ${end.toLocaleDateString("fr-FR", opts)}`;
  })();

  const isFuture = (d: Date) => d.getTime() > todayStart.getTime();

  const handleSelect = (d: Date) => {
    if (isFuture(d)) return;
    setSelected(d);
    if (onSelectDate) onSelectDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900/60 rounded-xl p-4 shadow-md">

      <div className="flex items-center justify-between text-gray-400 text-sm mb-3">
        <button className="px-2 text-lg" onClick={prevWeek} aria-label="Semaine précédente">‹</button>
        <div>{rangeLabel}</div>
        <button className={`px-2 text-lg ${startOfWeek(todayStart).getTime() <= weekStart.getTime() ? "opacity-50 cursor-not-allowed" : ""}`} onClick={nextWeek} aria-label="Semaine suivante">›</button>
      </div>

      <div className="flex items-center justify-between mb-3">
        {days.map((d, i) => (
          <div key={i} className="text-center text-xs text-gray-400 w-8">{d}</div>
        ))}
      </div>

      <div className="flex gap-2">
        {daysInWeek.map((d, i) => {
          const sel = d.getTime() === selected.getTime();
          const disabled = isFuture(d);
          return (
            <button
              key={i}
              onClick={() => handleSelect(d)}
              disabled={disabled}
              className={`w-10 h-10 rounded-lg ${sel ? "bg-indigo-700 text-white ring-2 ring-indigo-500" : disabled ? "bg-gray-900/40 text-gray-600 cursor-not-allowed" : "bg-gray-800 text-gray-400"}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
