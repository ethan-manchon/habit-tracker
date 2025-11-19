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
        default: "border-transparent bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700",
        success: "border-transparent bg-green-600 text-white hover:bg-green-700",
        warning: "border-transparent bg-yellow-600 text-white hover:bg-yellow-700",
        danger: "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "border-gray-700 text-gray-400 hover:bg-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)}>
      {children}
    </div>
  );
}

export { badgeVariants };
