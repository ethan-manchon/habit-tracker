/**
 * @file Button.tsx
 * @description Composant bouton réutilisable avec variantes de style.
 * 
 * @usage
 * ```tsx
 * <Button variant="default" size="default">Texte</Button>
 * <Button variant="danger" size="sm" fullWidth>Supprimer</Button>
 * <Button variant="ghost" size="icon"><Icon /></Button>
 * ```
 * 
 * @variants
 * - default: Bouton principal (accent color)
 * - secondary: Bouton secondaire (fond gris)
 * - outline: Bordure visible, fond transparent
 * - ghost: Aucun fond, effet hover subtil
 * - gradient: Dégradé indigo → violet
 * - danger: Actions destructives (rouge)
 * 
 * @sizes
 * - default: Taille standard (h-11)
 * - sm: Petit (h-9)
 * - lg: Grand (h-12)
 * - icon: Carré pour icônes seules (h-10 w-10)
 */

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ButtonDataProps {
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

interface ButtonStyleProps {
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "gradient" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
}

type ButtonProps = ButtonDataProps & ButtonStyleProps;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent cursor-pointer",
        secondary: "bg-background-secondary text-foreground hover:bg-background-tertiary border border-border focus-visible:ring-border cursor-pointer",
        outline: "border border-border bg-transparent text-foreground hover:bg-background-secondary focus-visible:ring-border cursor-pointer",
        ghost: "text-muted hover:bg-background-secondary hover:text-foreground focus-visible:ring-border cursor-pointer",
        gradient: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus-visible:ring-accent cursor-pointer",
        danger: "bg-danger text-white hover:bg-red-700 focus-visible:ring-danger cursor-pointer",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({
  variant = "default",
  size = "default",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { buttonVariants };
