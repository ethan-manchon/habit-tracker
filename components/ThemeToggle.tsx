/**
 * @file ThemeToggle.tsx
 * @description Bouton de bascule entre thème clair et sombre.
 * 
 * @usage
 * ```tsx
 * <ThemeToggle />
 * ```
 * 
 * @features
 * - Icône animée (rotation Soleil ↔ Lune)
 * - Placeholder pendant le montage SSR
 */

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "@/lib/Icon";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-xl bg-background-secondary hover:bg-background-tertiary transition-colors cursor-pointer"
        aria-label="Changer de thème"
      >
        <span className="w-5 h-5 block" />
      </button>
    );
  }

  return (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-background-secondary hover:bg-background-tertiary transition-colors cursor-pointer"
      aria-label="Changer de thème"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-foreground" />
        )}
      </motion.div>
    </motion.button>
  );
}
