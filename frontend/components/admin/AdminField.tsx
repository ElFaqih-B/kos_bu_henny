import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
};

function fieldClassName(
  error?: string,
  className?: string,
) {
  return [
    "w-full rounded-[9px] border bg-white text-sm",
    "text-(--ink) outline-none transition",
    "placeholder:text-(--stone)/70",
    "focus:border-(--accent) focus:ring-2",
    "focus:ring-(--accent)/10",
    error
      ? "border-red-300"
      : "border-(--line)",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function AdminInput({
  label,
  hint,
  error,
  className,
  ...props
}: BaseProps &
  InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold">
        {label}
      </span>

      <input
        {...props}
        className={fieldClassName(
          error,
          `min-h-11 px-3.5 ${className ?? ""}`,
        )}
      />

      {hint && (
        <span className="text-[11px] leading-4 text-(--stone)">
          {hint}
        </span>
      )}

      {error && (
        <span className="text-[11px] text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

export function AdminSelect({
  label,
  hint,
  error,
  className,
  children,
  ...props
}: BaseProps &
  SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold">
        {label}
      </span>

      <select
        {...props}
        className={fieldClassName(
          error,
          `min-h-11 px-3.5 ${className ?? ""}`,
        )}
      >
        {children}
      </select>

      {hint && (
        <span className="text-[11px] leading-4 text-(--stone)">
          {hint}
        </span>
      )}

      {error && (
        <span className="text-[11px] text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

export function AdminTextarea({
  label,
  hint,
  error,
  className,
  ...props
}: BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold">
        {label}
      </span>

      <textarea
        {...props}
        className={fieldClassName(
          error,
          `min-h-28 resize-y px-3.5 py-3 ${className ?? ""}`,
        )}
      />

      {hint && (
        <span className="text-[11px] leading-4 text-(--stone)">
          {hint}
        </span>
      )}

      {error && (
        <span className="text-[11px] text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
