/**
 * @file Card.tsx
 * @description Composant carte réutilisable avec variantes de style.
 * 
 * @usage
 * ```tsx
 * <Card variant="default" padding="default">
 *   <CardHeader>
 *     <CardTitle>Titre</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Contenu</CardContent>
 *   <CardFooter>Actions</CardFooter>
 * </Card>
 * ```
 * 
 * @variants
 * - default: Fond carte standard avec bordure
 * - gradient: Dégradé indigo → violet (CTAs)
 * - glass: Effet glassmorphism translucide
 * - outline: Bordure visible, fond transparent
 * 
 * @padding
 * - none: Pas de padding (p-0)
 * - sm: Petit padding (p-4)
 * - default: Padding standard (p-6)
 * - lg: Grand padding (p-8)
 */

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface CardDataProps {
  children?: React.ReactNode;
}

interface CardStyleProps {
  className?: string;
  variant?: "default" | "gradient" | "glass" | "outline";
  padding?: "none" | "sm" | "default" | "lg";
}

type CardProps = CardDataProps & CardStyleProps;

const cardVariants = cva(
  "rounded-2xl border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card border-border text-card-foreground shadow-card",
        gradient: "bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white",
        glass: "bg-card/50 backdrop-blur-sm border-border text-card-foreground",
        outline: "bg-transparent border-border text-card-foreground",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export function Card({
  variant = "default",
  padding = "default",
  className,
  children,
}: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight text-foreground", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <p className={cn("text-sm text-muted", className)}>
      {children}
    </p>
  );
}

export function CardContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("pt-0", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex items-center pt-0", className)}>
      {children}
    </div>
  );
}

export { cardVariants };
