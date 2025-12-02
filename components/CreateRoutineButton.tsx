"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AddRoutine from "@/components/AddRoutine";
import { Plus } from "@/lib/Icon";

export default function CreateRoutineButton({ onClick }: { onClick?: () => void }) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <AnimatePresence>
        {modal && (
          <AddRoutine open={modal} onClose={() => setModal(false)} />
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => setModal(true)}
        className="fixed right-3 sm:right-6 bottom-20 sm:bottom-24 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent hover:bg-accent-hover shadow-xl flex items-center justify-center text-white z-40"
        aria-label="Créer une routine"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17,
          delay: 0.2 
        }}
      >
        <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
      </motion.button>
    </>
  );
}
