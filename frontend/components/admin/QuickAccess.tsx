import {
  ChevronRight,
  ImagePlus,
  PanelTop,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Dokumentasi",
    description: "Tambah atau hapus galeri",
    href: "/admin/dokumentasi",
    icon: ImagePlus,
  },
  {
    title: "Fasilitas",
    description: "Kelola fasilitas kamar",
    href: "/admin/fasilitas",
    icon: Sparkles,
  },
  {
    title: "Landing Page",
    description: "Ubah konten dan kontak",
    href: "/admin/pengaturan",
    icon: PanelTop,
  },
];

export default function QuickAccess() {
  return (
    <article className="overflow-hidden rounded-xl border border-(--line) bg-white">
      <div className="flex min-h-17.5 items-center border-b border-[#eeeae5] px-4 py-4 sm:px-4.5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-lg tracking-tight">
            Kelola Website
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Akses cepat ke fitur utama.
          </p>
        </div>
      </div>

      <div className="grid gap-1 px-3 pb-3 pt-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="
                grid min-h-17
                grid-cols-[38px_minmax(0,1fr)_18px]
                items-center gap-2.5
                border-b border-[#f0ece8]
                px-1.5 py-2.5 text-left last:border-0
                hover:bg-[#fbfaf8]
              "
            >
              <div className="grid size-9.5 place-items-center rounded-[9px] bg-(--cream) text-(--accent)">
                <Icon size={17} />
              </div>

              <div className="grid min-w-0 gap-1">
                <strong className="text-[11px]">
                  {action.title}
                </strong>
                <span className="truncate text-[9px] text-(--muted)">
                  {action.description}
                </span>
              </div>

              <ChevronRight
                size={15}
                className="text-[#aaa39b]"
              />
            </Link>
          );
        })}
      </div>
    </article>
  );
}
