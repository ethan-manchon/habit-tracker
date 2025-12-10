/**
 * @file RoutineList.tsx
 * @description Liste des routines avec gestion de la progression.
 * Affiche les routines filtrées par date avec mise à jour optimiste.
 * 
 * @usage
 * ```tsx
 * <RoutineList date="2024-01-15" userId="user123" />
 * ```
 * 
 * @features
 * - Chargement automatique des routines et de la progression
 * - Mise à jour optimiste pour les toggles (fire-and-forget)
 * - Debounce de 300ms pour les valeurs numériques
 * - Filtrage par jour selon la fréquence (DAILY, SPECIFIC_DAYS)
 * - Barre de progression globale
 * - Modal de confirmation pour la suppression
 * 
 * @state
 * - routines: Liste des routines de l'utilisateur
 * - progressByRoutine: Map de la progression par ID de routine
 */

"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import RoutineCard from "@/components/RoutineCard";
import AddRoutine from "@/components/AddRoutine";
import Modal from "@/components/Modal";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Target } from "@/lib/Icon";

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

export default function RoutineList({ userId, date }: Props) {
  const [routines, setRoutines] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [progressByRoutine, setProgressByRoutine] = React.useState<Record<string, any>>({});
  const [editingRoutine, setEditingRoutine] = React.useState<any | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  // Debounce refs for numeric updates
  const debounceTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  const selectedDate = React.useMemo(() => {
    if (date instanceof Date) return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (typeof date === "string" && date) return new Date(date);
    return new Date();
  }, [date]);

  const dateStr = React.useMemo(() => formatDateStr(selectedDate), [selectedDate]);

  const isToday = React.useMemo(() => {
    const today = new Date();
    return (
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate()
    );
  }, [selectedDate]);

  // Load routines once
  React.useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch('/api/routines')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.error) {
          setError(data.error);
          setRoutines([]);
        } else {
          setRoutines(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => mounted && setError('Erreur lors du chargement'))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [userId]);

  // Load progress when date changes
  React.useEffect(() => {
    if (routines.length === 0) {
      setProgressByRoutine({});
      return;
    }

    let mounted = true;
    fetch(`/api/progress?date=${dateStr}`)
      .then((res) => res.json())
      .then((list) => {
        if (!mounted || !Array.isArray(list)) return;
        const map: Record<string, any> = {};
        for (const p of list) {
          if (p?.routineId) map[p.routineId] = p;
        }
        setProgressByRoutine(map);
      })
      .catch(console.error);

    return () => { mounted = false; };
  }, [routines.length, dateStr]);

  // Optimistic toggle (boolean) - immediate UI + fire-and-forget request
  const handleToggle = React.useCallback((routineId: string, value: boolean) => {
    // Optimistic update
    setProgressByRoutine((prev) => ({
      ...prev,
      [routineId]: { ...prev[routineId], booleanValue: value }
    }));

    // Fire request (no await needed for optimistic)
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ routineId, date: dateStr, booleanValue: value }),
    }).catch(console.error);
  }, [dateStr]);

  // Debounced numeric update - immediate UI + debounced request
  const handleNumericChange = React.useCallback((routineId: string, value: number) => {
    // Immediate UI update
    setProgressByRoutine((prev) => ({
      ...prev,
      [routineId]: { ...prev[routineId], numericValue: value }
    }));

    // Clear existing timer
    if (debounceTimers.current[routineId]) {
      clearTimeout(debounceTimers.current[routineId]);
    }

    // Debounced server sync (300ms)
    debounceTimers.current[routineId] = setTimeout(() => {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ routineId, date: dateStr, numericValue: value }),
      }).catch(console.error);
    }, 300);
  }, [dateStr]);

  // Trigger delete confirmation modal
  const handleDelete = React.useCallback((id: string) => {
    setPendingDeleteId(id);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    // Optimistic
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    setProgressByRoutine((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    try {
      const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression');
      setPendingDeleteId(null);
    } catch (err: any) {
      console.error(err);
      // rollback
      const res = await fetch('/api/routines');
      const data = await res.json();
      if (Array.isArray(data)) setRoutines(data);
      setDeleteError(err?.message || 'Impossible de supprimer la routine');
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId]);

  const reloadRoutines = React.useCallback(async () => {
    const res = await fetch('/api/routines');
    const data = await res.json();
    if (Array.isArray(data)) setRoutines(data);
  }, []);

  const isForDate = (r: any, targetDate: Date) => {
    try {
      const freq = r.frequency;
      const dayIdx = targetDate.getDay();

      if (freq === 'DAILY') return true;

      if (freq === 'SPECIFIC_DAYS') {
        const w = r.weekDays || [];
        return Array.isArray(w) && w.includes(dayIdx);
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

  const completedCount = React.useMemo(() => {
    return todays.reduce((acc, r) => {
      const p = progressByRoutine[r.id];
      if (r.type === 'BOOLEAN') {
        return acc + (p?.booleanValue ? 1 : 0);
      }
      if (r.type === 'NUMERIC') {
        return acc + ((p?.numericValue ?? 0) >= (r.goal ?? 1) ? 1 : 0);
      }
      return acc;
    }, 0);
  }, [todays, progressByRoutine]);

  const progressPct = todays.length > 0 ? Math.round((completedCount / todays.length) * 100) : 0;

  return (
    <div className="w-full max-w-lg mx-auto max-h-list mb-24 overflow-auto">
      {/* Progress Header */}
      <motion.div
        className="flex items-center justify-between mb-3 sm:mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          {isToday ? (
            <h2 className="text-base sm:text-lg font-bold text-foreground">Aujourd&apos;hui</h2>
          ) : (
            <h2 className="text-base sm:text-lg font-bold text-foreground">{selectedDate.toLocaleDateString()}</h2>
          )}
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
              <p className="text-sm sm:text-base text-muted font-medium">Aucune routine pour ce jour</p>
              <p className="text-xs sm:text-sm text-muted/60 mt-1">Appuie sur + pour en créer une</p>
            </motion.div>
          )}

          {todays.map((r, index) => {
            const p = progressByRoutine[r.id];
            const toggled = r.type === 'BOOLEAN' ? Boolean(p?.booleanValue) : false;
            const progress = r.type === 'NUMERIC'
              ? (p?.numericValue ?? 0)
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
                  onToggle={(value) => handleToggle(r.id, value)}
                  onNumericChange={(value) => handleNumericChange(r.id, value)}
                  onEdit={() => setEditingRoutine(r)}
                  onDelete={() => handleDelete(r.id)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Delete confirmation modal */}
      {pendingDeleteId && (
        <Modal onClose={() => setPendingDeleteId(null)}>
          <Card className="max-w-sm">
            <CardHeader className="p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Supprimer la routine</h3>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-foreground">Voulez-vous vraiment supprimer cette routine ? Cette action est irréversible.</p>
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="ghost" onClick={() => setPendingDeleteId(null)}>Annuler</Button>
                <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
              </div>
            </CardContent>
          </Card>
        </Modal>
      )}

      {/* Delete error modal */}
      {deleteError && (
        <Modal onClose={() => setDeleteError(null)}>
          <Card className="max-w-sm">
            <CardHeader className="p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-danger">Erreur</h3>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-foreground">{deleteError}</p>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setDeleteError(null)}>Fermer</Button>
              </div>
            </CardContent>
          </Card>
        </Modal>
      )}

      <AnimatePresence>
        {editingRoutine && (
          <AddRoutine
            open={true}
            onClose={() => setEditingRoutine(null)}
            onCreated={() => {
              setEditingRoutine(null);
              reloadRoutines();
            }}
            initial={editingRoutine}
          />
        )}
      </AnimatePresence>
    </div>
  );
}