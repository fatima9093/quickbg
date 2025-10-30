import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40 hover:scale-105 active:scale-95",
      secondary:
        "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
      outline:
        "bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 hover:border-gray-400",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:shadow-xl hover:scale-105 active:scale-95",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

