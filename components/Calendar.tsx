/**
 * @file Calendar.tsx
 * @description Calendrier hebdomadaire pour la sélection de dates.
 * Affiche une semaine à la fois avec navigation.
 * 
 * @usage
 * ```tsx
 * <Calendar
 *   selectedDate={new Date()}
 *   onSelectDate={(date) => setSelectedDate(date)}
 * />
 * ```
 * 
 * @features
 * - Navigation par semaine (précédent/suivant)
 * - Désactivation des dates futures
 * - Mise en évidence du jour actuel
 * - Affichage responsive (L/M/M sur mobile, Lun/Mar/Mer sur desktop)
 */

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "@/lib/Icon";

const days = ["L", "M", "M", "J", "V", "S", "D"];
const daysFull = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

type Props = {
  selectedDate?: Date;
  onSelectDate?: (d: Date) => void;
};

function startOfWeek(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); 
  const diff = (day + 6) % 7;
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
    const currentWeek = startOfWeek(todayStart);
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
  const isToday = (d: Date) => d.getTime() === todayStart.getTime();

  const handleSelect = (d: Date) => {
    if (isFuture(d)) return;
    setSelected(d);
    if (onSelectDate) onSelectDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  };

  const canGoNext = startOfWeek(todayStart).getTime() > weekStart.getTime();

  return (
    <motion.div 
      className="w-full max-w-lg mx-auto bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <motion.button 
          className="p-1.5 sm:p-2 rounded-xl hover:bg-background-secondary transition-colors"
          onClick={prevWeek} 
          aria-label="Semaine précédente"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </motion.button>
        
        <span className="text-xs sm:text-sm font-semibold text-foreground">{rangeLabel}</span>
        
        <motion.button 
          className={`p-1.5 sm:p-2 rounded-xl transition-colors ${canGoNext ? "hover:bg-background-secondary" : "opacity-30 cursor-not-allowed"}`}
          onClick={nextWeek} 
          aria-label="Semaine suivante"
          whileTap={canGoNext ? { scale: 0.9 } : {}}
          disabled={!canGoNext}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </motion.button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {daysInWeek.map((d, i) => {
          const sel = d.getTime() === selected.getTime();
          const disabled = isFuture(d);
          const todayDay = isToday(d);
          
          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(d)}
              disabled={disabled}
              className="flex flex-col items-center gap-0.5 sm:gap-1 py-1.5 sm:py-2"
              whileTap={!disabled ? { scale: 0.9 } : {}}
            >
              <span className={`text-2xs sm:text-xs font-medium ${sel ? "text-accent" : "text-muted"}`}>
                <span className="sm:hidden">{days[i]}</span>
                <span className="hidden sm:inline">{daysFull[i]}</span>
              </span>
              <motion.div 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold transition-colors
                  ${sel 
                    ? "bg-accent text-white shadow-lg shadow-accent/30" 
                    : disabled 
                      ? "bg-transparent text-muted/40 cursor-not-allowed" 
                      : todayDay
                        ? "bg-accent/10 text-accent hover:bg-accent/20"
                        : "bg-background-secondary text-foreground hover:bg-background-tertiary"
                  }`}
                animate={sel ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                {d.getDate()}
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
