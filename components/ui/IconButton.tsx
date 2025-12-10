/**
 * @file IconButton.tsx
 * @description Bouton carré conçu pour contenir uniquement une icône.
 * 
 * @usage
 * ```tsx
 * <IconButton variant="default" onClick={handleClick}>
 *   <EditIcon />
 * </IconButton>
 * <IconButton variant="ghost" size="lg">
 *   <SettingsIcon />
 * </IconButton>
 * ```
 * 
 * @variants
 * - default: Fond accent
 * - secondary: Fond gris
 * - ghost: Transparent avec hover
 * - gradient: Dégradé indigo → violet
 * - danger: Fond rouge
 * 
 * @sizes
 * - sm: Petit (w-8 h-8)
 * - default: Standard (w-10 h-10)
 * - lg: Grand (w-12 h-12)
 */

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "ghost" | "gradient" | "danger";
  size?: "sm" | "default" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent",
        secondary: "bg-background-secondary text-foreground hover:bg-background-tertiary border border-border focus-visible:ring-border",
        ghost: "text-muted hover:bg-background-secondary hover:text-foreground focus-visible:ring-border",
        gradient: "bg-gradient-to-br from-accent to-purple-600 text-white shadow-lg hover:from-indigo-700 hover:to-purple-700",
        danger: "bg-danger text-white hover:bg-red-700 focus-visible:ring-danger",
      },
      size: {
        sm: "w-8 h-8",
        default: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function IconButton({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { iconButtonVariants };
