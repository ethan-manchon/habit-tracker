"use client";
import React, { useState } from "react";
import Modal from "@/components/Modal";
import Card, { CardHeader, CardContent } from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";

const ICONS = ["🏃", "📚", "💧", "🧘", "💪", "🎨", "✍️", "🎯", "🌱", "🔥"];
const PRESET_TAGS = ["Sport", "Santé", "Travail", "Loisir"];

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initial?: any;
};

export default function AddRoutine({ open, onClose, onCreated, initial }: Props) {
  const [mode, setMode] = useState<"BOOLEAN" | "NUMERIC">("BOOLEAN");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string | null>(ICONS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"DAILY" | "EVERY_N_DAYS" | "SPECIFIC_DAYS">("DAILY");
  const [everyNDays, setEveryNDays] = useState<number>(2);
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [goal, setGoal] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initial) {
      setMode(initial.type === 'NUMERIC' ? 'NUMERIC' : 'BOOLEAN');
      setName(initial.name || '');
      setIcon(initial.icon ?? ICONS[0]);
      setTags((initial.tags || []).map((t: any) => (t?.name ? t.name : t)));
      setFrequency(initial.frequency || 'DAILY');
      setEveryNDays(initial.everyNDays ?? 2);
      setWeekDays(initial.weekDays || []);
      setGoal(initial.goal ?? 1);
    }
  }, [initial]);

  if (!open) return null;

  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const toggleWeekDay = (d: number) => {
    setWeekDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const submit = async () => {
    if (!name.trim()) return alert("Donnez un nom à la routine");
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        icon,
        type: mode === "BOOLEAN" ? "BOOLEAN" : "NUMERIC",
        goal: mode === "NUMERIC" ? Math.max(1, Math.floor(goal)) : undefined,
        frequency: frequency,
        everyNDays: frequency === "EVERY_N_DAYS" ? Math.max(1, Math.floor(everyNDays)) : undefined,
        weekDays: frequency === "SPECIFIC_DAYS" ? weekDays : undefined,
        tags,
      } as any;

      let res: Response;
      if (initial && initial.id) {
        res = await fetch(`/api/routines/${initial.id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/routines", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error || "Erreur serveur");
      }

      // success
      setName("");
      setTags([]);
      setWeekDays([]);
      setEveryNDays(2);
      setGoal(1);
      if (onCreated) onCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <Card>
        <CardHeader>
        </CardHeader>
          <div className="mb-4">
            <h3 className="text-lg text-gray-300">Nom de la routine</h3>
            <Input placeholder="Ex: Faire du sport" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        <CardContent>
          <div className="mb-4">
            <div className="flex gap-2 bg-gray-800 rounded-full items-center p-1">
              <p className="text-sm">Type :</p>
              <button onClick={() => setMode("BOOLEAN")} className={`px-4 py-2 rounded-full ${mode === "BOOLEAN" ? "bg-gray-700 text-white" : "text-gray-300"}`}>Oui/Non</button>
              <button onClick={() => setMode("NUMERIC")} className={`px-4 py-2 rounded-full ${mode === "NUMERIC" ? "bg-gray-700 text-white" : "text-gray-300"}`}>Numérique</button>
            </div>
          </div>



          <div className="mb-4">
            <label className="text-sm text-gray-300">Icône</label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`p-3 rounded-lg ${icon === ic ? "bg-indigo-700 ring-2 ring-indigo-500" : "bg-gray-800"}`}
                >
                  <span className="text-2xl">{ic}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-300">Tags <span className="text-gray-300/60">(optionnel)</span></label>
            <div className="flex gap-2 mt-2">
              {PRESET_TAGS.map((t) => (
                <button key={t} onClick={() => toggleTag(t)} className={`px-3 py-1 rounded-full border text-sm ${tags.includes(t) ? "bg-gray-700 border-green-500 text-white" : "bg-gray-800 text-gray-300"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-300">Fréquence</label>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setFrequency("DAILY")} className={`px-3 py-1 rounded-full ${frequency === "DAILY" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}`}>Quotidienne</button>
              <button onClick={() => setFrequency("EVERY_N_DAYS")} className={`px-3 py-1 rounded-full ${frequency === "EVERY_N_DAYS" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}`}>Répétition</button>
              <button onClick={() => setFrequency("SPECIFIC_DAYS")} className={`px-3 py-1 rounded-full ${frequency === "SPECIFIC_DAYS" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}`}>Personnalisé</button>
            </div>

            {frequency === "EVERY_N_DAYS" && (
              <div className="mt-3 flex flex-row items">
                <Input type="number" min={1} max={7} value={String(everyNDays ?? "")} onChange={(e) => setEveryNDays(Number(e.target.value))}   className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
 /> <p className="ml-2 text-sm text-gray-300/60 whitespace-nowrap">par semaine</p>
              </div>
            )}

            {frequency === "SPECIFIC_DAYS" && (
              <div className="mt-3 grid grid-cols-7 gap-2 text-center">
                {['D','L','M','M','J','V','S'].map((d, i) => (
                  <button key={d} onClick={() => toggleWeekDay(i)} className={`py-2 rounded-md ${weekDays.includes(i) ? 'bg-indigo-700 text-white' : 'bg-gray-800 text-gray-300'}`}>
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {mode === "NUMERIC" && (
            <div className="mb-4">
              <label className="text-sm text-gray-300">Valeur à atteindre</label>
              <Input type="number" min={0} max={100} value={String(goal ?? "") } onChange={(e) => setGoal(Number(e.target.value))} />
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mt-6">
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
            <Button onClick={submit} disabled={loading}>{loading ? '...' : 'Ajouter'}</Button>
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
}
