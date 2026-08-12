"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Edit3,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import { adminClientDelete } from "@/lib/admin-client";

type Item = {
  id: number;
  title: string;
  subtitle?: string;
  meta?: string;
  active?: boolean;
  href?: string;
};

type Props = {
  items: Item[];
  addHref?: string;
  addLabel?: string;
  emptyTitle: string;
  emptyText: string;
  deletePath?: string;
};

export default function CrudList({
  items,
  addHref,
  addLabel = "Tambah",
  emptyTitle,
  emptyText,
  deletePath,
}: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<
    number | null
  >(null);

  const filteredItems = useMemo(() => {
    const normalized = query
      .trim()
      .toLowerCase();

    if (!normalized) {
      return items;
    }

    return items.filter((item) =>
      [
        item.title,
        item.subtitle,
        item.meta,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [items, query]);

  async function remove(item: Item) {
    if (!deletePath) {
      return;
    }

    if (!window.confirm(`Hapus ${item.title}?`)) {
      return;
    }

    setLoading(item.id);

    try {
      await adminClientDelete(
        `${deletePath.replace(/\/$/, "")}/${item.id}`,
      );
      window.location.reload();
    } catch (cause) {
      window.alert(
        cause instanceof Error
          ? cause.message
          : "Gagal menghapus data.",
      );
      setLoading(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-(--line) bg-white">
      <div className="flex flex-col gap-3 border-b border-(--line) p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-lg">
            Daftar data
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            {items.length} data terdaftar
          </p>
        </div>

        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--stone)"
            />
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Cari..."
              className="
                h-10 w-full rounded-[9px] border border-(--line)
                bg-(--cream)/30 pl-9 pr-3 text-xs outline-none
                transition focus:border-(--accent)
              "
            />
          </label>

          {addHref && (
            <AdminButton href={addHref}>
              <Plus size={15} />
              <span className="hidden sm:inline">
                {addLabel}
              </span>
              <span className="sm:hidden">
                Tambah
              </span>
            </AdminButton>
          )}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="divide-y divide-(--line)">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-4 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">
                    {item.title}
                  </h3>

                  {item.active !== undefined && (
                    <StatusBadge active={item.active} />
                  )}
                </div>

                {item.subtitle && (
                  <p className="mt-1 truncate text-[11px] text-(--muted)">
                    {item.subtitle}
                  </p>
                )}

                {item.meta && (
                  <p className="mt-1 line-clamp-2 text-[10px] text-(--stone)">
                    {item.meta}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {item.href && (
                  <Link
                    href={item.href}
                    aria-label={`Buka ${item.title}`}
                    className="grid size-9 place-items-center rounded-lg text-(--stone) transition hover:bg-(--cream) hover:text-(--ink)"
                  >
                    <Edit3 size={15} />
                  </Link>
                )}

                {deletePath && (
                  <button
                    type="button"
                    disabled={loading === item.id}
                    onClick={() => remove(item)}
                    aria-label={`Hapus ${item.title}`}
                    className="
                    grid size-9 place-items-center rounded-lg
                    text-(--stone) transition hover:bg-red-50
                    hover:text-red-700 disabled:opacity-40
                  "
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-14 text-center">
          <p className="text-sm font-semibold">
            {query
              ? "Data tidak ditemukan."
              : emptyTitle}
          </p>
          <p className="mt-1 text-xs text-(--stone)">
            {query
              ? "Coba kata kunci lain."
              : emptyText}
          </p>
        </div>
      )}
    </section>
  );
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={
        active
          ? "shrink-0 rounded-full bg-[#e9f2ec] px-2 py-1 text-[9px] font-bold text-[#47775f]"
          : "shrink-0 rounded-full bg-[#f6e8e9] px-2 py-1 text-[9px] font-bold text-[#a44d55]"
      }
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}
