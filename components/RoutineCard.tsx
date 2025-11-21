"use client";
import React from "react";
import Input from "./ui/Input";

type Props = {
  icon?: React.ReactNode;
  title: string;
  tags?: string[];
  progress?: number;
  goal?: number;
  toggled?: boolean;
  onToggle?: (value: boolean) => void | Promise<void>;
  type?: "BOOLEAN" | "NUMERIC";
  onNumericChange?: (value: number) => void | Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function RoutineCard({ icon, title, tags = [], progress = 0, goal = 1, toggled = false, onToggle, type, onNumericChange, onEdit, onDelete }: Props) {
  const pct = Math.min(100, Math.round((progress / Math.max(1, goal)) * 100));
  const [showActions, setShowActions] = React.useState(false);
  const longPressTimer = React.useRef<any>(null);
  const [menuPos, setMenuPos] = React.useState<{ x: number; y: number } | null>(null);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowActions(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches && e.touches[0];
    if (t) setMenuPos({ x: t.clientX, y: t.clientY });
    longPressTimer.current = setTimeout(() => setShowActions(true), 600);
  };

  const onTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowActions(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="bg-gray-900/60 rounded-xl p-4 shadow-md max-w-lg relative"
      >
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
            {type === 'NUMERIC' ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-16 bg-gray-800 text-white rounded-md px-2 text-sm"
                  value={String(progress ?? 0)}
                  onChange={(e) => {
                    const v = Number(e.target.value || 0);
                    if (onNumericChange) onNumericChange(v);
                  }}
                  min={0} max={goal}
                />
                <div className="text-sm text-gray-300 whitespace-nowrap">/ {goal}</div>
              </div>
            ) : (
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={toggled}
                  onChange={() => {
                    if (onToggle) onToggle(!toggled);
                  }}
                />
                <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer peer-checked:bg-green-700 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
              </label>
            )}
          </div>
        </div>

        <div className="mt-4">
          {type === 'NUMERIC' ? (<>
            <div className="text-xs text-gray-400 mb-1">{progress} / {goal}</div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              {pct < 50 ? (<div className="h-2 rounded-full bg-red-700" style={{ width: `${pct}%` }} />) 
              : pct < 100 ? (<div className="h-2 rounded-full bg-yellow-700" style={{ width: `${pct}%` }} />)
              : (<div className="h-2 rounded-full bg-green-700" style={{ width: `${pct}%` }} />)}

              
            </div>
          </>
          ) : null}
        </div>
      </div>

      {showActions && menuPos && (
        <div className="fixed inset-0 z-10">
          {/* backdrop to close when clicking elsewhere */}
          <div className="absolute inset-0" onClick={() => setShowActions(false)} onContextMenu={() => setShowActions(false)} />

          {/* small popup positioned next to the click/tap */}
          <div
            className="absolute z-20"
            style={{
              left: `${menuPos.x}px`,
              top: `${menuPos.y}px`,
              transform: 'translate(0%, 12px)',
              willChange: 'transform',
            }}
          >
            <div className="bg-gray-800 rounded-md p-1 ">
              <button
                className="w-full text-left cursor-pointer px-3 py-2 rounded hover:bg-gray-700 text-white text-sm"
                onClick={() => {
                  setShowActions(false);
                  if (onEdit) onEdit();
                }}
              >
                Éditer
              </button>
              <button
                className="w-full text-left px-3 cursor-pointer py-2 rounded hover:bg-red-500 text-red-100 text-sm mt-1 bg-red-600"
                onClick={() => {
                  setShowActions(false);
                  if (onDelete) onDelete();
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
