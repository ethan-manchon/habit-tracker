/**
 * @file HomeSection.tsx
 * @description Section principale de la page d'accueil.
 * Affiche le calendrier, la liste des routines et le bouton de création.
 * 
 * @usage
 * ```tsx
 * <HomeSection className="mt-4" />
 * ```
 * 
 * @state
 * - selectedDate: Date actuellement sélectionnée dans le calendrier
 * - refreshKey: Clé pour forcer le rechargement de la liste
 */

"use client";

import React from "react";
import { motion } from "motion/react";
import Calendar from "@/components/Calendar";
import RoutineList from "@/components/RoutineList";
import CreateRoutineButton from "@/components/CreateRoutineButton";

interface HomeSectionProps {
  className?: string;
}

/**
 * Formate une date en chaîne YYYY-MM-DD pour l'API.
 */
function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function HomeSection({ className }: HomeSectionProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  });
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleRoutineCreated = React.useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <motion.section
      className={`flex flex-col items-center gap-3 sm:gap-4 md:gap-6 w-full ${className ?? ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Calendar 
        selectedDate={selectedDate} 
        onSelectDate={(d: Date) => setSelectedDate(d)} 
      />
      <RoutineList 
        key={refreshKey} 
        date={formatDate(selectedDate)} 
      />
      <CreateRoutineButton onCreated={handleRoutineCreated} />
    </motion.section>
  );
}
