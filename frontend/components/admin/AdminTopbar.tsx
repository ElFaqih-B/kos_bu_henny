"use client";

import { ExternalLink, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  username: string;
};

export default function AdminTopbar({
  username,
}: Props) {
  useEffect(() => {
    const sidebar = document.getElementById(
      "admin-sidebar",
    );
    const backdrop = document.getElementById(
      "admin-sidebar-backdrop",
    );
    const menuButton = document.getElementById(
      "admin-menu-button",
    );

    if (!sidebar || !backdrop || !menuButton) {
      return;
    }

    const openSidebar = () => {
      sidebar.classList.remove(
        "-translate-x-full",
      );
      backdrop.classList.remove(
        "pointer-events-none",
        "opacity-0",
      );
      backdrop.classList.add(
        "pointer-events-auto",
        "opacity-100",
      );
      document.body.style.overflow = "hidden";
    };

    const closeSidebar = () => {
      sidebar.classList.add(
        "-translate-x-full",
      );
      backdrop.classList.add(
        "pointer-events-none",
        "opacity-0",
      );
      backdrop.classList.remove(
        "pointer-events-auto",
        "opacity-100",
      );
      document.body.style.overflow = "";
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    menuButton.addEventListener(
      "click",
      openSidebar,
    );
    backdrop.addEventListener(
      "click",
      closeSidebar,
    );
    window.addEventListener(
      "admin-sidebar-close",
      closeSidebar,
    );
    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      menuButton.removeEventListener(
        "click",
        openSidebar,
      );
      backdrop.removeEventListener(
        "click",
        closeSidebar,
      );
      window.removeEventListener(
        "admin-sidebar-close",
        closeSidebar,
      );
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <header className="flex min-h-20.5 items-center gap-3 py-3 sm:min-h-22">
      <button
        id="admin-menu-button"
        type="button"
        aria-label="Buka menu navigasi"
        className="
          grid size-10 shrink-0 place-items-center
          rounded-[9px] border border-(--line)
          bg-white text-(--ink) transition
          hover:bg-(--cream) lg:hidden
        "
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-(--accent)">
          Panel Admin
        </p>

        <h1 className="
          truncate font-(family-name:--font-fraunces)
          text-[22px] font-semibold leading-tight
          tracking-[-0.035em] sm:text-[16px]
        ">
          Selamat datang, {username}
        </h1>

        <p className="mt-1 hidden text-xs text-(--muted) sm:block">
          Kelola informasi Kos Omah Subardiman.
        </p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            hidden h-10 items-center gap-2 rounded-[9px]
            border border-(--line) bg-white px-3 text-[11px]
            font-semibold transition hover:bg-(--cream)
            sm:inline-flex
          "
        >
          <ExternalLink size={15} />
          Lihat Website
        </Link>

        <Link
          href="/admin/kamar/tambah"
          className="
            inline-flex h-10 items-center justify-center gap-2
            rounded-[9px] bg-(--ink) px-3.5 text-[11px]
            font-semibold text-white! transition
            hover:bg-[#1f1c1a]
          "
        >
          <Plus size={15} />
          <span className="hidden sm:inline">
            Tambah Kamar
          </span>
          <span className="sm:hidden">
            Tambah
          </span>
        </Link>
      </div>
    </header>
  );
}
