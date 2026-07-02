import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-accent text-accent-foreground hover:brightness-110 border border-transparent shadow-sm",
  secondary:
    "bg-transparent border border-card-border hover:border-accent hover:text-accent",
  ghost: "bg-transparent hover:bg-surface hover:text-accent",
  danger:
    "bg-transparent border border-red-400/30 text-red-400 hover:border-red-400 hover:bg-red-400/10",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
