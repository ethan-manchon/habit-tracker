"use client";
import React from "react";
import RoutineCard from "./RoutineCard";
import AddRoutine from "./AddRoutine";

type Props = {
  userId?: string;
  // date can be a Date object or a string YYYY-MM-DD
  date?: string | Date;
};

export default function RoutineList({ userId, date }: Props) {
  const [routines, setRoutines] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError('Erreur lors du chargement des routines');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [userId]);

  const [editingRoutine, setEditingRoutine] = React.useState<any | null>(null);

  const reloadRoutines = async () => {
    try {
      const res = await fetch('/api/routines');
      const data = await res.json();
      if (Array.isArray(data)) setRoutines(data);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch progresses for the selected date and map by routineId
  const [progressByRoutine, setProgressByRoutine] = React.useState<Record<string, any>>({});
  React.useEffect(() => {
    let mounted = true;
    if (!routines || routines.length === 0) {
      setProgressByRoutine({});
      return;
    }

    // compute dateStr from prop `date` or fallback to today
    const selected = date instanceof Date
      ? date
      : (typeof date === 'string' && date ? new Date(date) : new Date());
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    fetch(`/api/progress?date=${dateStr}`)
      .then((res) => res.json())
      .then((list) => {
        if (!mounted) return;
        if (!Array.isArray(list)) return;
        const map: Record<string, any> = {};
        for (const p of list) {
          if (p?.routineId) map[p.routineId] = p;
        }
        setProgressByRoutine(map);
      })
      .catch((err) => console.error(err));

    return () => {
      mounted = false;
    };
  }, [routines, date]);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette routine ?')) return;
    try {
      const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression');
      setRoutines((prev) => prev.filter((x) => x.id !== id));
      setProgressByRoutine((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert('Impossible de supprimer la routine');
    }
  };

  const isForDate = (r: any, targetDate: Date) => {
    try {
      const freq = r.frequency;
      const dayIdx = targetDate.getDay(); // 0 = Sunday .. 6 = Saturday

      if (freq === 'DAILY') return true;

      if (freq === 'SPECIFIC_DAYS') {
        const w = r.weekDays || [];
        return Array.isArray(w) && w.includes(dayIdx);
      }

      if (freq === 'EVERY_N_DAYS') {
        const n = Number(r.everyNDays) || 0;
        if (!n || !r.createdAt) return false;
        const created = new Date(r.createdAt);
        // Compare dates at midnight to count full days
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

  // compute selected date used for filtering and POST payloads
  const selectedDate = date instanceof Date
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : (typeof date === 'string' && date ? new Date(date) : new Date());

  const todays = routines.filter((r) => isForDate(r, selectedDate));
  const completedCount = todays.reduce((acc, r) => {
    const p = progressByRoutine[r.id];
    if (!p) return acc;
    if (r.type === 'BOOLEAN') return acc + (p.booleanValue ? 1 : 0);
    // numeric: consider completed when numericValue >= goal
    if (r.type === 'NUMERIC') return acc + ((p.numericValue ?? 0) >= (r.goal ?? 1) ? 1 : 0);
    return acc;
  }, 0);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Aujourd&apos;hui</h2>
        <div className="text-sm text-gray-400">{completedCount}/{todays.length} complétées</div>
      </div>

      {loading && <div className="text-sm text-gray-400">Chargement...</div>}
      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="flex flex-col gap-4">
        {todays.length === 0 && !loading && <div className="text-sm text-gray-500">Aucune routine pour aujourd&apos;hui.</div>}

                {todays.map((r) => {
          const p = progressByRoutine[r.id];
          const toggled = r.type === 'BOOLEAN' ? Boolean(p?.booleanValue) : false;
          const progress = r.type === 'NUMERIC' ? (p?.numericValue ?? 0) : (p?.booleanValue ? 1 : 0);
          const handleToggle = async (value: boolean) => {
            try {
              const sel = selectedDate;
              const yyyy = sel.getFullYear();
              const mm = String(sel.getMonth() + 1).padStart(2, '0');
              const dd = String(sel.getDate()).padStart(2, '0');
              const dateStr = `${yyyy}-${mm}-${dd}`;

              await fetch('/api/progress', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ routineId: r.id, date: dateStr, booleanValue: value }),
              });

              // optimistic update
              setProgressByRoutine((prev) => ({ ...prev, [r.id]: { ...(prev[r.id] || {}), booleanValue: value } }));
            } catch (err) {
              console.error(err);
            }
          };

          return (
            <RoutineCard
              key={r.id}
              title={r.name}
              icon={r.icon}
              tags={(r.tags || []).map((t: any) => t.name)}
              progress={progress}
              goal={r.goal ?? 1}
              toggled={toggled}
              type={r.type}
              onToggle={handleToggle}
              onNumericChange={async (value: number) => {
                try {
                  const sel = selectedDate;
                  const yyyy = sel.getFullYear();
                  const mm = String(sel.getMonth() + 1).padStart(2, '0');
                  const dd = String(sel.getDate()).padStart(2, '0');
                  const dateStr = `${yyyy}-${mm}-${dd}`;
                  await fetch('/api/progress', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ routineId: r.id, date: dateStr, numericValue: value }),
                  });
                  setProgressByRoutine((prev) => ({ ...prev, [r.id]: { ...(prev[r.id] || {}), numericValue: value } }));
                } catch (err) {
                  console.error(err);
                }
              }}
              onEdit={() => setEditingRoutine(r)}
              onDelete={() => handleDelete(r.id)}
            />
          );
        })}
      </div>

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
    </div>
  );
}