"use client";
import React, {useState} from "react";
import AddRoutine from "./AddRoutine";


export default function CreateRoutineButton({ onClick }: { onClick?: () => void }) {
const [modal, setModal] = useState(false);

if (modal) {
  return <AddRoutine open={modal} onClose={() => setModal(false)} />;
}
  return (
    <button
      onClick={() => setModal(true)}
      className="fixed right-6 bottom-24 w-14 h-14 rounded-full bg-purple-600 shadow-lg flex items-center justify-center text-white text-2xl"
      aria-label="Créer une routine"
    >
      +
    </button>
  );
}
