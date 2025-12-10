/**
 * @file Header.tsx
 * @description En-tête de page avec titre, toggle de thème et bouton de déconnexion.
 * 
 * @usage
 * ```tsx
 * <Header title="Routines" />
 * ```
 */

"use client";
import React from "react";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User } from "@/lib/Icon";
import Disconnected from "./ui/Disconnected";

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
          <Disconnected button />
        </div>
      </div>
    </header>
  );
}
