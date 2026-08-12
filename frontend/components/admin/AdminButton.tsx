import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const variantClasses = {
  primary:
    "bg-(--ink) text-white! hover:bg-[#1f1c1a]",
  secondary:
    "border border-(--line) bg-white text-(--ink) hover:border-(--line-strong) hover:bg-(--cream)",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
};

export default function AdminButton({
  href,
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
}: Props) {
  const className = [
    "inline-flex min-h-11 items-center justify-center gap-2",
    "rounded-[9px] px-4 text-sm font-semibold transition",
    "focus:outline-none focus-visible:ring-2",
    "focus-visible:ring-(--accent)/30",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
