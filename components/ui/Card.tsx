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
        default: "bg-gray-800 border-gray-700",
        gradient: "bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent",
        glass: "bg-gray-800/50 backdrop-blur-sm border-gray-700",
        outline: "bg-transparent border-gray-700",
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

export default function Card({
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
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight text-white", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: { className?: string; children?: any }) {
  return (
    <p className={cn("text-sm text-gray-400", className)}>
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
