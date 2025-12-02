import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface BadgeDataProps {
  children?: any;
}

interface BadgeStyleProps {
  className?: string;
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline";
}

type BadgeProps = BadgeDataProps & BadgeStyleProps;

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-white hover:bg-accent-hover",
        secondary: "border-border bg-background-secondary text-muted hover:bg-background-tertiary",
        success: "border-transparent bg-success text-white hover:bg-green-700",
        warning: "border-transparent bg-warning text-white hover:bg-yellow-700",
        danger: "border-transparent bg-danger text-white hover:bg-red-700",
        outline: "border-border text-muted hover:bg-background-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)}>
      {children}
    </div>
  );
}

export { badgeVariants };
