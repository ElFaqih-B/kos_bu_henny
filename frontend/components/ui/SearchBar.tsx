"use client";

import { Search, X } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
}: SearchBarProps) {
  return (
    <div
      className={`
        flex min-h-11 items-center gap-3
        rounded-lg border border-(--line)
        bg-white px-3
        transition
        focus-within:border-(--line-strong)
        ${className}
      `}
    >
      {/* Icon */}
      <Search
        size={18}
        className="shrink-0 text-(--stone)"
      />

      {/* Input */}
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="
          min-w-0 flex-1
          bg-transparent
          text-sm text-(--ink)
          outline-none
          placeholder:text-(--stone)
          [&::-webkit-search-cancel-button]:hidden
        "
      />

      {/* Clear */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Hapus pencarian"
          className="
            grid size-8 shrink-0 place-items-center
            rounded-md text-(--stone)
            transition
            hover:bg-(--cream)
            hover:text-(--ink)
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}