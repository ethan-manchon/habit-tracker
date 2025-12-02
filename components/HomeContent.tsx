"use client";
import React from "react";
import { motion } from "motion/react";
import Calendar from "@/components/Calendar";
import RoutineList from "@/components/RoutineList";

export default function HomeContent() {
    const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    });

    return (
        <motion.div 
            className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Calendar selectedDate={selectedDate} onSelectDate={(d: Date) => setSelectedDate(d)} />
            <RoutineList date={formatDate(selectedDate)} />
        </motion.div>
    );
}

function formatDate(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
