"use client";

import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

type Props = {
  username: string;
};

const mainNavigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Kamar",
    href: "/admin/kamar",
    icon: BedDouble,
  },
  {
    label: "Cabang",
    href: "/admin/cabang",
    icon: MapPinned,
  },
  {
    label: "Fasilitas",
    href: "/admin/fasilitas",
    icon: Sparkles,
  },
  {
    label: "Dokumentasi",
    href: "/admin/dokumentasi",
    icon: Images,
  },
  {
    label: "Konten",
    href: "/admin/konten",
    icon: FileText,
  },
];

const settingsNavigation = [
  {
    label: "Pengaturan Website",
    href: "/admin/pengaturan",
    icon: Settings2,
  },
];

export default function AdminSidebar({
  username,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  function closeSidebar() {
    window.dispatchEvent(
      new Event("admin-sidebar-close"),
    );
  }

  async function logout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <>
      <aside
        id="admin-sidebar"
        className="
          fixed inset-y-0 left-0 z-50 flex w-70
          -translate-x-full flex-col bg-[#171717] text-white
          transition-transform duration-200 lg:w-53.25
          lg:translate-x-0
        "
      >
        <div className="flex min-h-20.5 items-center justify-between px-5">
          <div className="min-w-0">
            <strong className="block font-(family-name:--font-fraunces) text-[17px] leading-tight tracking-[-0.02em]">
              Kos Omah
              <br className="lg:hidden" />
              {" "}Subardiman
            </strong>
            <span className="mt-1 block text-[11px] text-white/40">
              Admin Panel
            </span>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Tutup menu"
            className="grid size-9 place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <NavigationGroup
            label="UTAMA"
            items={mainNavigation}
            isActive={isActive}
            onNavigate={closeSidebar}
          />

          <NavigationGroup
            label="PENGATURAN"
            items={settingsNavigation}
            isActive={isActive}
            onNavigate={closeSidebar}
          />
        </div>

        <div className="border-t border-white/6 p-3">
          <p className="px-3 text-[10px] text-white/35">
            Masuk sebagai{" "}
            <span className="font-semibold text-white/65">
              {username}
            </span>
          </p>

          <button
            type="button"
            onClick={logout}
            className="
              mt-1 flex min-h-11 w-full items-center gap-3
              rounded-[7px] px-3 text-left text-[12px]
              font-semibold text-white/62 transition
              hover:bg-[#72383d] hover:text-white
            "
          >
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </aside>

      <div
        id="admin-sidebar-backdrop"
        className="pointer-events-none fixed inset-0 z-40 bg-black/40 opacity-0 transition-opacity lg:hidden"
      />
    </>
  );
}

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavigationGroupProps = {
  label: string;
  items: NavigationItem[];
  isActive: (href: string) => boolean;
  onNavigate: () => void;
};

function NavigationGroup({
  label,
  items,
  isActive,
  onNavigate,
}: NavigationGroupProps) {
  const sectionClassName =
    label === "PENGATURAN"
      ? "mt-7"
      : "mt-3";

  return (
    <section className={sectionClassName}>
      <p className="mb-2 px-2.5 text-[9px] font-bold tracking-[0.15em] text-white/30">
        {label}
      </p>

      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={[
                "flex min-h-11 items-center gap-3 rounded-[9px] px-3",
                "text-[12px] font-semibold transition",
                isActive(item.href)
                  ? "bg-[#252525] text-white"
                  : "text-white/62 hover:bg-[#222] hover:text-white",
              ].join(" ")}
            >
              <Icon
                size={17}
                strokeWidth={1.8}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
