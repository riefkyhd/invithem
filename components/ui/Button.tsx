import Link from "next/link";
import type { ComponentProps, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:brightness-110 border border-transparent shadow-sm",
  secondary:
    "bg-transparent border border-card-border hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-muted hover:bg-surface hover:text-foreground",
  danger:
    "bg-transparent border border-red-400/30 text-red-400 hover:border-red-400 hover:bg-red-400/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-sm",
};

type SharedButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  active = false,
  className = "",
}: SharedButtonProps): string {
  const activeStyles = active
    ? "bg-accent/15 font-medium text-accent hover:text-accent"
    : "";
  return `inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${activeStyles} ${className}`;
}

type ButtonAsButton = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedButtonProps> & {
    href?: undefined;
  };

type ButtonAsLink = SharedButtonProps &
  Omit<ComponentProps<typeof Link>, keyof SharedButtonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    active = false,
    className = "",
    children,
    ...rest
  } = props;

  const classes = buttonClassName({ variant, size, active, className });

  if ("href" in props && props.href) {
    const { href, ...linkProps } = rest as Omit<ButtonAsLink, keyof SharedButtonProps>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
