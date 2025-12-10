/**
 * @file LoadingSpinner.tsx
 * @description Composant spinner de chargement réutilisable.
 * 
 * @usage
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" />
 * <LoadingSpinner className="text-accent" />
 * ```
 * 
 * @sizes
 * - sm: Petit spinner (w-4 h-4)
 * - default: Taille standard (w-5 h-5)
 * - lg: Grand spinner (w-6 h-6)
 */

"use client";

import { motion } from "motion/react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

const spinnerVariants = cva(
  "border-2 border-current/30 border-t-current rounded-full",
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        default: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export function LoadingSpinner({ className, size = "default" }: LoadingSpinnerProps) {
  return (
    <motion.div
      className={cn(spinnerVariants({ size }), className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
