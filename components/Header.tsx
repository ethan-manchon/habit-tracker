"use client";
import React from "react";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User } from "@/lib/Icon";

export default function Header({ title }: { title?: string }) {
  return (
    <header className="w-full max-w-2xl mx-auto pt-4 sm:pt-8 pb-3 sm:pb-4 px-1">
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-lg sm:text-xl text-foreground font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <motion.div 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
