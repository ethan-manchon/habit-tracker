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
};

export default function AddRoutine({ open, onClose, onCreated }: Props) {
  const [mode, setMode] = useState<"BOOLEAN" | "NUMERIC">("BOOLEAN");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string | null>(ICONS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"DAILY" | "EVERY_N_DAYS" | "SPECIFIC_DAYS">("DAILY");
  const [everyNDays, setEveryNDays] = useState<number>(2);
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [goal, setGoal] = useState<number>(1);
  const [loading, setLoading] = useState(false);

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

      const res = await fetch("/api/routines", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

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
    <Modal>
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Nouvelle routine</h3>
          <p className="text-sm text-gray-400">Crée une nouvelle routine pour suivre ta progression quotidienne.</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex gap-2 bg-gray-800 rounded-full p-1">
              <button onClick={() => setMode("BOOLEAN")} className={`px-4 py-2 rounded-full ${mode === "BOOLEAN" ? "bg-gray-700 text-white" : "text-gray-300"}`}>Oui/Non</button>
              <button onClick={() => setMode("NUMERIC")} className={`px-4 py-2 rounded-full ${mode === "NUMERIC" ? "bg-gray-700 text-white" : "text-gray-300"}`}>Numérique</button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-300">Nom de la routine</label>
            <Input placeholder="Ex: Faire du sport" value={name} onChange={(e) => setName(e.target.value)} />
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
            <label className="text-sm text-gray-300">Tags (optionnel)</label>
            <div className="flex gap-2 mt-2">
              {PRESET_TAGS.map((t) => (
                <button key={t} onClick={() => toggleTag(t)} className={`px-3 py-1 rounded-full text-sm ${tags.includes(t) ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-300">Fréquence</label>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setFrequency("DAILY")} className={`px-3 py-1 rounded-full ${frequency === "DAILY" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}`}>Tous les jours</button>
              <button onClick={() => setFrequency("EVERY_N_DAYS")} className={`px-3 py-1 rounded-full ${frequency === "EVERY_N_DAYS" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}`}>Tous les n jours</button>
              <button onClick={() => setFrequency("SPECIFIC_DAYS")} className={`px-3 py-1 rounded-full ${frequency === "SPECIFIC_DAYS" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}`}>Jours spécifiques</button>
            </div>

            {frequency === "EVERY_N_DAYS" && (
              <div className="mt-3">
                <Input type="number" value={String(everyNDays ?? "")} onChange={(e) => setEveryNDays(Number(e.target.value))} />
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
              <Input type="number" value={String(goal ?? "") } onChange={(e) => setGoal(Number(e.target.value))} />
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
