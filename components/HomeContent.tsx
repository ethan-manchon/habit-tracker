"use client";
import React from "react";
import Calendar from "./Calendar";
import RoutineList from "./RoutineList";

export default function HomeContent() {
    const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    });

    return (
        <div className="flex flex-col items-center gap-6">
            <Calendar selectedDate={selectedDate} onSelectDate={(d: Date) => setSelectedDate(d)} />
            <RoutineList date={formatDate(selectedDate)} />
        </div>
    );
}

function formatDate(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
