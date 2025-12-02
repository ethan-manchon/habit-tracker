"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import RoutineCard from "@/components/RoutineCard";
import AddRoutine from "@/components/AddRoutine";
import { CheckCircle, Target } from "@/lib/Icon";
import { useRoutines, useProgress } from "@/lib/hooks/useRoutines";

type Props = {
  userId?: string;
  date?: string | Date;
};

function formatDateStr(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Debounce hook for numeric inputs
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  return React.useCallback(
    ((...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
    }) as T,
    [delay]
  );
}

export default function RoutineList({ userId, date }: Props) {
  const { routines, isLoading: loadingRoutines, error, mutate: mutateRoutines } = useRoutines();
  
  const selectedDate = React.useMemo(() => {
    if (date instanceof Date) return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (typeof date === "string" && date) return new Date(date);
    return new Date();
  }, [date]);

  const dateStr = React.useMemo(() => formatDateStr(selectedDate), [selectedDate]);
  
  const { progress: progressByRoutine, isLoading: loadingProgress, mutate: mutateProgress } = useProgress(dateStr);

  const [editingRoutine, setEditingRoutine] = React.useState<any | null>(null);
  
  // Local state for immediate numeric updates (debounced server sync)
  const [localNumericValues, setLocalNumericValues] = React.useState<Record<string, number>>({});

  // Optimistic update for progress (used for boolean toggles)
  const updateProgress = React.useCallback(
    async (routineId: string, updates: { booleanValue?: boolean; numericValue?: number }) => {
      // Optimistic update - update UI immediately
      mutateProgress(
        (currentData: any[] | undefined) => {
          if (!currentData) return [{ routineId, ...updates }];
          const existing = currentData.find((p) => p.routineId === routineId);
          if (existing) {
            return currentData.map((p) =>
              p.routineId === routineId ? { ...p, ...updates } : p
            );
          }
          return [...currentData, { routineId, ...updates }];
        },
        false // Don't revalidate immediately
      );

      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ routineId, date: dateStr, ...updates }),
        });
      } catch (err) {
        console.error(err);
        // Revalidate on error to restore correct state
        mutateProgress();
      }
    },
    [dateStr, mutateProgress]
  );

  // Debounced server update for numeric values (500ms delay)
  const debouncedNumericUpdate = useDebouncedCallback(
    async (routineId: string, numericValue: number) => {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ routineId, date: dateStr, numericValue }),
        });
        // Update SWR cache after server update
        mutateProgress();
      } catch (err) {
        console.error(err);
        mutateProgress();
      }
    },
    500
  );

  // Handler for numeric changes - immediate local update + debounced server sync
  const handleNumericChange = React.useCallback(
    (routineId: string, value: number) => {
      // Immediate local update for responsive UI
      setLocalNumericValues((prev) => ({ ...prev, [routineId]: value }));
      // Debounced server update
      debouncedNumericUpdate(routineId, value);
    },
    [debouncedNumericUpdate]
  );

  const loading = loadingRoutines || loadingProgress;

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette routine ?')) return;
    
    // Optimistic update
    mutateRoutines(
      (currentData: any[] | undefined) => {
        if (!currentData) return currentData;
        return currentData.filter((r) => r.id !== id);
      },
      false
    );

    try {
      const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression');
    } catch (err) {
      console.error(err);
      alert('Impossible de supprimer la routine');
      mutateRoutines(); // Restore on error
    }
  };

  const isForDate = (r: any, targetDate: Date) => {
    try {
      const freq = r.frequency;
      const dayIdx = targetDate.getDay();

      if (freq === 'DAILY') return true;

      if (freq === 'SPECIFIC_DAYS') {
        const w = r.weekDays || [];
        return Array.isArray(w) && w.includes(dayIdx);
      }

      if (freq === 'EVERY_N_DAYS') {
        const n = Number(r.everyNDays) || 0;
        if (!n || !r.createdAt) return false;
        const created = new Date(r.createdAt);
        const t0 = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
        const c0 = new Date(created.getFullYear(), created.getMonth(), created.getDate()).getTime();
        const days = Math.floor((t0 - c0) / (1000 * 60 * 60 * 24));
        return days >= 0 && days % n === 0;
      }

      return false;
    } catch (e) {
      return false;
    }
  };

  const todays = React.useMemo(
    () => routines.filter((r) => isForDate(r, selectedDate)),
    [routines, selectedDate]
  );
  
  // Calculate completion using local numeric values for immediate feedback
  const completedCount = React.useMemo(() => {
    return todays.reduce((acc, r) => {
      const p = progressByRoutine[r.id];
      if (r.type === 'BOOLEAN') {
        return acc + (p?.booleanValue ? 1 : 0);
      }
      if (r.type === 'NUMERIC') {
        // Use local value if available, otherwise server value
        const numValue = localNumericValues[r.id] ?? p?.numericValue ?? 0;
        return acc + (numValue >= (r.goal ?? 1) ? 1 : 0);
      }
      return acc;
    }, 0);
  }, [todays, progressByRoutine, localNumericValues]);

  const progressPct = todays.length > 0 ? Math.round((completedCount / todays.length) * 100) : 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress Header */}
      <motion.div 
        className="flex items-center justify-between mb-3 sm:mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          <h2 className="text-base sm:text-lg font-bold text-foreground">Aujourd&apos;hui</h2>
        </div>
        <motion.div 
          className="flex items-center gap-1.5 sm:gap-2 bg-background-secondary px-2 sm:px-3 py-1 sm:py-1.5 rounded-full"
          animate={{ scale: completedCount === todays.length && todays.length > 0 ? [1, 1.1, 1] : 1 }}
        >
          <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${completedCount === todays.length && todays.length > 0 ? 'text-success' : 'text-muted'}`} />
          <span className="text-xs sm:text-sm font-semibold text-foreground">{completedCount}/{todays.length}</span>
        </motion.div>
      </motion.div>

      {/* Progress Bar */}
      {todays.length > 0 && (
        <motion.div 
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-full bg-background-tertiary rounded-full h-2 sm:h-2.5 overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${progressPct === 100 ? 'bg-success' : 'bg-accent'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-background-tertiary rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-background-tertiary rounded w-3/4 mb-2" />
                  <div className="h-3 bg-background-tertiary rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <motion.div 
          className="text-sm text-danger bg-danger-soft p-3 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      <div className="flex flex-col gap-2 sm:gap-3">
        <AnimatePresence>
          {todays.length === 0 && !loading && (
            <motion.div 
              className="text-center py-8 sm:py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-muted mx-auto mb-3" />
              <p className="text-sm sm:text-base text-muted font-medium">Aucune routine pour aujourd&apos;hui</p>
              <p className="text-xs sm:text-sm text-muted/60 mt-1">Appuie sur + pour en créer une</p>
            </motion.div>
          )}

          {todays.map((r, index) => {
            const p = progressByRoutine[r.id];
            const toggled = r.type === 'BOOLEAN' ? Boolean(p?.booleanValue) : false;
            // Use local value for immediate feedback, fall back to server value
            const progress = r.type === 'NUMERIC' 
              ? (localNumericValues[r.id] ?? p?.numericValue ?? 0) 
              : (p?.booleanValue ? 1 : 0);

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <RoutineCard
                  title={r.name}
                  icon={r.icon}
                  tags={(r.tags || []).map((t: any) => t.name)}
                  progress={progress}
                  goal={r.goal ?? 1}
                  toggled={toggled}
                  type={r.type}
                  onToggle={(value) => updateProgress(r.id, { booleanValue: value })}
                  onNumericChange={(value) => handleNumericChange(r.id, value)}
                  onEdit={() => setEditingRoutine(r)}
                  onDelete={() => handleDelete(r.id)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editingRoutine && (
          <AddRoutine
            open={true}
            onClose={() => setEditingRoutine(null)}
            onCreated={() => {
              setEditingRoutine(null);
              mutateRoutines();
            }}
            initial={editingRoutine}
          />
        )}
      </AnimatePresence>
    </div>
  );
}