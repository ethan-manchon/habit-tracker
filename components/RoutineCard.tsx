"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/Input";
import { Running, Book, Droplet, Dumbbell, Target, Flame, Sparkles, Heart, Briefcase, Gamepad, Check, Edit, Trash } from "@/lib/Icon";

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

const ICONS = [
  { key: "running", Icon: Running },
  { key: "book", Icon: Book },
  { key: "droplet", Icon: Droplet },
  { key: "dumbbell", Icon: Dumbbell },
  { key: "target", Icon: Target },
  { key: "flame", Icon: Flame },
  { key: "sparkles", Icon: Sparkles },
  { key: "heart", Icon: Heart },
  { key: "briefcase", Icon: Briefcase },
  { key: "gamepad", Icon: Gamepad },
];

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

  const isCompleted = type === 'BOOLEAN' ? toggled : pct >= 100;

  return (
    <>
      <motion.div
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`bg-card border-2 ${isCompleted ? 'border-success/50' : 'border-border'} rounded-2xl p-3 sm:p-4 shadow-sm relative transition-colors`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        layout
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <motion.div 
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${isCompleted ? 'bg-success/20' : 'bg-accent/10'} flex items-center justify-center flex-shrink-0`}
              animate={{ scale: isCompleted ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {typeof icon === 'string'
                ? (() => {
                    const found = ICONS.find(({ key }) => key === icon);
                    if (found) {
                      const IconComp = found.Icon;
                      return <IconComp className={`w-5 h-5 sm:w-6 sm:h-6 ${isCompleted ? 'text-success' : 'text-accent'}`} />;
                    }
                    return <span className="text-xl sm:text-2xl">{icon}</span>;
                  })()
                : icon
                ? icon
                : <Running className={`w-5 h-5 sm:w-6 sm:h-6 ${isCompleted ? 'text-success' : 'text-accent'}`} />}
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className={`text-sm sm:text-base font-semibold truncate ${isCompleted ? 'text-success line-through' : 'text-foreground'}`}>
                {title}
              </div>
              {tags.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {tags.map((t) => (
                    <span key={t} className="text-[10px] sm:text-xs bg-accent/10 text-accent px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {type === 'NUMERIC' ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Input
                  type="number"
                  className="w-12 sm:w-14 bg-input text-foreground rounded-lg px-2 text-xs sm:text-sm h-8"
                  value={String(progress ?? 0)}
                  onChange={(e) => {
                    const v = Number(e.target.value || 0);
                    if (onNumericChange) onNumericChange(v);
                  }}
                  min={0} max={goal}
                />
                <div className="text-xs sm:text-sm text-muted whitespace-nowrap">/ {goal}</div>
              </div>
            ) : (
              <motion.button
                onClick={() => onToggle && onToggle(!toggled)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition-colors ${
                  toggled 
                    ? 'bg-success border-success text-white' 
                    : 'bg-transparent border-border hover:border-accent'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence>
                  {toggled && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>

        {type === 'NUMERIC' && (
          <div className="mt-3">
            <div className="w-full bg-background-tertiary rounded-full h-2 sm:h-2.5 overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${pct < 50 ? 'bg-danger' : pct < 100 ? 'bg-warning' : 'bg-success'}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showActions && menuPos && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-overlay/50" onClick={() => setShowActions(false)} />

            <motion.div
              className="absolute z-50"
              style={{
                left: `${Math.min(menuPos.x, window.innerWidth - 160)}px`,
                top: `${menuPos.y - 100}px`,
              }}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 12 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className="bg-card border border-border rounded-xl p-1.5 shadow-xl min-w-[140px]">
                <motion.button
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-background-secondary text-foreground text-sm font-medium"
                  onClick={() => {
                    setShowActions(false);
                    if (onEdit) onEdit();
                  }}
                  whileHover={{ x: 2 }}
                >
                  <Edit className="w-4 h-4" />
                  Éditer
                </motion.button>
                <motion.button
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-danger/90 text-white text-sm font-medium mt-1 bg-danger"
                  onClick={() => {
                    setShowActions(false);
                    if (onDelete) onDelete();
                  }}
                  whileHover={{ x: 2 }}
                >
                  <Trash className="w-4 h-4" />
                  Supprimer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
