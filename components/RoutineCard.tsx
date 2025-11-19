"use client";
import React from "react";

type Props = {
  icon?: React.ReactNode;
  title: string;
  tags?: string[];
  progress?: number;
  goal?: number;
  toggled?: boolean;
};

export default function RoutineCard({ icon, title, tags = [], progress = 0, goal = 1, toggled = false }: Props) {
  const pct = Math.min(100, Math.round((progress / Math.max(1, goal)) * 100));

  return (
    <div className="bg-gray-900/60 rounded-xl p-4 shadow-md w-full max-w-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{icon ?? "🏃"}</div>
          <div>
            <div className="text-sm text-gray-100 font-medium">{title}</div>
            <div className="flex gap-2 mt-2">
              {tags.map((t) => (
                <span key={t} className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={toggled} />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600" />
          </label>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-gray-400 mb-1">{progress} / {goal}</div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
