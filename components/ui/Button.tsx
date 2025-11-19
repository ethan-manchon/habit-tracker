import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ButtonDataProps {
  children?: any;
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
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 cursor-pointer",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 focus-visible:ring-gray-500 cursor-pointer",
        outline: "border border-gray-700 bg-transparent text-white hover:bg-gray-800 focus-visible:ring-gray-500 cursor-pointer",
        ghost: "text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:ring-gray-500 cursor-pointer",
        gradient: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus-visible:ring-indigo-500 cursor-pointer",
        danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 cursor-not-allowed",
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

export default function Button({
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
