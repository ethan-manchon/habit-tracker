import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface CardDataProps {
  children?: any;
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
        default: "bg-card border-border text-card-foreground",
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

export function CardHeader({ className, children }: { className?: string; children?: any }) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children?: any }) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight text-foreground", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: { className?: string; children?: any }) {
  return (
    <p className={cn("text-sm text-muted", className)}>
      {children}
    </p>
  );
}

export function CardContent({ className, children }: { className?: string; children?: any }) {
  return (
    <div className={cn("pt-0", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children }: { className?: string; children?: any }) {
  return (
    <div className={cn("flex items-center pt-0", className)}>
      {children}
    </div>
  );
}

export { cardVariants };
