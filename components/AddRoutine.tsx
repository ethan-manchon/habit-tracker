"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Modal from "@/components/Modal";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Running, Book, Droplet, Dumbbell, Target, Flame, Sparkles, Heart, Briefcase, Gamepad, X, Check, Plus } from "@/lib/Icon";

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
  const [icon, setIcon] = useState<string | null>(ICONS[0].key);
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
      setIcon(initial.icon ?? ICONS[0].key);
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

  const SelectedIconComponent = ICONS.find((i) => i.key === icon)?.Icon || Running;

  return (
    <Modal onClose={onClose}>
      <Card className="max-h-[85vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            {initial?.id ? "Modifier la routine" : "Nouvelle routine"}
          </h2>
          <motion.button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-background-secondary transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-muted" />
          </motion.button>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 pt-0 space-y-4 sm:space-y-5">
          {/* Routine Name */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
              Nom de la routine
            </label>
            <Input 
              placeholder="Ex: Faire du sport" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>

          {/* Type Toggle */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Type</label>
            <div className="flex gap-1.5 sm:gap-2 bg-background-secondary rounded-xl p-1">
              <motion.button 
                onClick={() => setMode("BOOLEAN")} 
                className={`flex-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${mode === "BOOLEAN" ? "bg-card text-foreground shadow-sm" : "text-muted"}`}
                whileTap={{ scale: 0.98 }}
              >
                Oui/Non
              </motion.button>
              <motion.button 
                onClick={() => setMode("NUMERIC")} 
                className={`flex-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${mode === "NUMERIC" ? "bg-card text-foreground shadow-sm" : "text-muted"}`}
                whileTap={{ scale: 0.98 }}
              >
                Numérique
              </motion.button>
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Icône</label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {ICONS.map(({ key, Icon }) => (
                <motion.button
                  key={key}
                  onClick={() => setIcon(key)}
                  className={`p-2 sm:p-3 rounded-xl flex items-center justify-center transition-colors ${icon === key ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-background-secondary text-muted hover:bg-background-tertiary"}`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
              Tags <span className="text-muted font-normal">(optionnel)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {PRESET_TAGS.map((t) => (
                <motion.button 
                  key={t} 
                  onClick={() => toggleTag(t)} 
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${tags.includes(t) ? "bg-success/20 text-success border border-success/30" : "bg-background-secondary border border-border text-muted hover:bg-background-tertiary"}`}
                  whileTap={{ scale: 0.95 }}
                >
                  {t}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Fréquence</label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <motion.button 
                onClick={() => setFrequency("DAILY")} 
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${frequency === "DAILY" ? "bg-accent text-white" : "bg-background-secondary text-muted hover:bg-background-tertiary"}`}
                whileTap={{ scale: 0.95 }}
              >
                Quotidienne
              </motion.button>
              <motion.button 
                onClick={() => setFrequency("EVERY_N_DAYS")} 
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${frequency === "EVERY_N_DAYS" ? "bg-accent text-white" : "bg-background-secondary text-muted hover:bg-background-tertiary"}`}
                whileTap={{ scale: 0.95 }}
              >
                Répétition
              </motion.button>
              <motion.button 
                onClick={() => setFrequency("SPECIFIC_DAYS")} 
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${frequency === "SPECIFIC_DAYS" ? "bg-accent text-white" : "bg-background-secondary text-muted hover:bg-background-tertiary"}`}
                whileTap={{ scale: 0.95 }}
              >
                Personnalisé
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {frequency === "EVERY_N_DAYS" && (
                <motion.div 
                  className="mt-2 sm:mt-3 flex items-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input 
                    type="number" 
                    min={1} 
                    max={7} 
                    value={String(everyNDays ?? "")} 
                    onChange={(e) => setEveryNDays(Number(e.target.value))}   
                    className="w-16 sm:w-20 text-center text-sm"
                  />
                  <span className="text-xs sm:text-sm text-muted">par semaine</span>
                </motion.div>
              )}

              {frequency === "SPECIFIC_DAYS" && (
                <motion.div 
                  className="mt-2 sm:mt-3 grid grid-cols-7 gap-1 sm:gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {['D','L','M','M','J','V','S'].map((d, i) => (
                    <motion.button 
                      key={i} 
                      onClick={() => toggleWeekDay(i)} 
                      className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${weekDays.includes(i) ? 'bg-accent text-white' : 'bg-background-secondary text-muted hover:bg-background-tertiary'}`}
                      whileTap={{ scale: 0.9 }}
                    >
                      {d}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Goal (Numeric mode) */}
          <AnimatePresence>
            {mode === "NUMERIC" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
                  Valeur à atteindre
                </label>
                <Input 
                  type="number" 
                  min={0} 
                  max={100} 
                  value={String(goal ?? "")} 
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="w-24 sm:w-28 text-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-border">
            <Button variant="ghost" onClick={onClose} className="text-xs sm:text-sm px-3 sm:px-4">
              Annuler
            </Button>
            <Button 
              onClick={submit} 
              disabled={loading}
              className="text-xs sm:text-sm px-3 sm:px-4 flex items-center gap-1.5"
            >
              {loading ? (
                <motion.div 
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {initial?.id ? "Modifier" : "Ajouter"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
}
