import Link from "next/link";
import { Images, Plus } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminServerGet } from "@/lib/admin-server-api";
import type {
  Cabang,
  Dokumentasi,
} from "@/lib/types";
import { mediaUrl } from "@/lib/media";

export default async function DokumentasiPage() {
  const [items, branches] =
    await Promise.all([
      adminServerGet<Dokumentasi[]>(
        "admin/dokumentasi",
      ),
      adminServerGet<Cabang[]>("admin/cabang"),
    ]);

  const branchMap = new Map(
    branches.map((branch) => [
      branch.id,
      branch.nama,
    ]),
  );

  return (
    <div>
      <AdminPageHeader
        eyebrow="Media"
        title="Dokumentasi"
        description="Kelola foto galeri website dan tentukan cabang yang terkait dengan setiap dokumentasi."
        action={
          <AdminButton href="/admin/dokumentasi/tambah">
            <Plus size={16} />
            Tambah dokumentasi
          </AdminButton>
        }
      />

      {items.length > 0 ? (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/dokumentasi/${item.id}`}
              className="group overflow-hidden rounded-xl border border-(--line) bg-white transition hover:border-(--line-strong)"
            >
              <div className="aspect-[4/3] bg-(--cream)">
                {mediaUrl(item.path_foto) ? (
                  <img
                    src={mediaUrl(item.path_foto) ?? undefined}
                    alt={item.teks_alt}
                    className="size-full object-cover transition duration-200 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-(--stone)">
                    <Images size={28} />
                  </div>
                )}
              </div>

              <div className="p-3.5">
                <p className="truncate text-xs font-semibold">
                  {item.caption || "Tanpa caption"}
                </p>
                <p className="mt-1 truncate text-[10px] text-(--muted)">
                  {item.cabang_id
                    ? branchMap.get(
                        item.cabang_id,
                      ) ?? "Cabang tidak ditemukan"
                    : "Semua cabang"}
                </p>
                <span
                  className={
                    item.aktif
                      ? "mt-2 inline-flex rounded-full bg-[#e9f2ec] px-2 py-1 text-[9px] font-bold text-[#47775f]"
                      : "mt-2 inline-flex rounded-full bg-[#f6e8e9] px-2 py-1 text-[9px] font-bold text-[#a44d55]"
                  }
                >
                  {item.aktif
                    ? "Aktif"
                    : "Nonaktif"}
                </span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="rounded-xl border border-(--line) bg-white px-5 py-14 text-center">
          <Images
            size={28}
            className="mx-auto text-(--stone)"
          />
          <p className="mt-3 text-sm font-semibold">
            Belum ada dokumentasi
          </p>
          <p className="mt-1 text-xs text-(--stone)">
            Tambahkan dokumentasi pertama untuk galeri website.
          </p>
        </section>
      )}
    </div>
  );
}
