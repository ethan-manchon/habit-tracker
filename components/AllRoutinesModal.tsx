"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import Modal from "./Modal";
import RoutineCard from "./RoutineCard";
import AddRoutine from "./AddRoutine";
import { Button } from "./ui/Button";
import { Book, Briefcase, Droplet, Dumbbell, Flame, Heart, Pencil, Running, Sparkles, Target, Trash } from "@/lib/Icon";

type Routine = {
    id: string;
    name: string;
    icon?: string;
    type?: "BOOLEAN" | "NUMERIC";
    goal?: number;
    frequency?: string;
    everyNDays?: number;
    weekDays?: number[];
    tags?: { name: string }[];
};

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AllRoutinesModal({ open, onClose }: Props) {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [editRoutine, setEditRoutine] = useState<Routine | null>(null);
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
        // Gamepad retiré car n'est pas une fonction React
    ];

    useEffect(() => {
        if (open) {
            fetch("/api/routines")
                .then((res) => res.json())
                .then((data) => setRoutines(Array.isArray(data) ? data : []));
        }
    }, [open]);

    return (
        <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-background/80 backdrop-blur-lg border border-border">
            <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Toutes les routines</h2>
            {editRoutine ? (
                <AddRoutine
                    open={true}
                    onClose={() => setEditRoutine(null)}
                    initial={editRoutine}
                    onCreated={() => {
                        setEditRoutine(null);
                        fetch("/api/routines")
                            .then((res) => res.json())
                            .then((data) => setRoutines(Array.isArray(data) ? data : []));
                    }}
                />
            ) : (
                <div className="border rounded-xl bg-background/60 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                    {routines.length === 0 ? (
                        <div className="text-muted text-center py-8">Aucune routine trouvée.</div>
                    ) : (
                        <motion.ul
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.07 } }
                            }}
                        >
                            {routines.map((routine) => (
                                <motion.li
                                    key={routine.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(99,102,241,0.08)" }}
                                    className="flex items-center border-b last:border-b-0 px-4 py-3 group transition-all"
                                >
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-row w-full items-center gap-2">
                                            {typeof routine.icon === 'string'
                                                ? (() => {
                                                    const found = ICONS.find(({ key, Icon }) => key === routine.icon && typeof Icon === "function");
                                                    if (found && typeof found.Icon === "function") {
                                                        const IconComp = found.Icon;
                                                        return <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />;
                                                    }
                                                    return <span className="text-xl sm:text-2xl">{routine.icon}</span>;
                                                })()
                                                : routine.icon
                                                    ? routine.icon
                                                    : <Running className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
                                            <span className="flex-1 w-32 truncate text-base text-foreground font-semibold mb-1">{routine.name}</span>
                                        </div>
                                        {routine.tags && routine.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-1">
                                                {routine.tags.map((tag) => (
                                                    <span key={tag.name} className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">{tag.name}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center gap-1 ml-1">
                                        <motion.div whileHover={{ scale: 1.1 }}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="font-semibold"
                                                onClick={() => setEditRoutine(routine)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.1 }}>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                className="font-semibold"
                                                onClick={() => {
                                                    if (window.confirm('Supprimer cette routine ?')) {
                                                        fetch(`/api/routines/${routine.id}`, { method: "DELETE" })
                                                            .then(() => {
                                                                setRoutines((prev) => prev.filter((r) => r.id !== routine.id));
                                                            });
                                                    }
                                                }}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </div>
            )}
            <div className="flex justify-center mt-8">
                <Button variant="ghost" className="px-6 py-2 text-lg" onClick={onClose}>Fermer</Button>
            </div>
        </div>
    );
}
