/**
 * @file Input.tsx
 * @description Composant champ de saisie réutilisable avec icônes et variantes.
 * 
 * @usage
 * ```tsx
 * <Input placeholder="Email" icon={<MailIcon />} />
 * <Input type="password" variant="error" iconRight={<EyeIcon />} />
 * <Input inputSize="lg" />
 * ```
 * 
 * @variants
 * - default: Style standard avec bordure grise
 * - error: Bordure rouge pour les erreurs de validation
 * 
 * @sizes
 * - default: Taille standard (h-11)
 * - sm: Petit (h-9)
 * - lg: Grand (h-12)
 * 
 * @props
 * - icon: Icône à gauche (non cliquable)
 * - iconRight: Icône à droite (bouton cliquable)
 */

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface InputDataProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  autoFocus?: boolean;
  iconRight?: React.ReactNode;
  min?: number;
  max?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface InputStyleProps {
  className?: string;
  variant?: "default" | "error";
  inputSize?: "default" | "sm" | "lg";
}

type InputProps = InputDataProps & InputStyleProps;

const inputVariants = cva(
  "flex w-full rounded-lg border bg-transparent px-4 py-3 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input-border bg-input text-foreground focus-visible:border-accent focus-visible:ring-accent",
        error: "border-danger bg-input text-foreground focus-visible:border-danger focus-visible:ring-danger",
      },
      inputSize: {
        default: "h-11 text-sm",
        sm: "h-9 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export function Input({
  variant = "default",
  inputSize = "default",
  autoFocus = false,
  className,
  min,
  max,
  type,
  icon,
  iconRight,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        min={min}
        max={max}
        minLength={min}
        maxLength={max}
        className={cn(
          inputVariants({ variant, inputSize }),
          icon && "pl-10",
          iconRight && "pr-10",
          className
        )}
        autoFocus={autoFocus}
        {...props}
      />
      {iconRight && (
        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {iconRight}
        </button>
      )}
    </div>
  );
}

export { inputVariants };
