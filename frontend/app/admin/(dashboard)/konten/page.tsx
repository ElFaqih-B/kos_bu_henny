import { Plus } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CrudList from "@/components/admin/CrudList";
import { adminServerGet } from "@/lib/admin-server-api";
import type { KontenHalaman } from "@/lib/types";

export default async function KontenPage() {
  const contents =
    await adminServerGet<KontenHalaman[]>(
      "admin/konten",
    );

  const items = contents.map((content) => ({
    id: content.id,
    title:
      content.judul || content.kunci,
    subtitle: content.kunci,
    meta: content.isi
      ? `${content.isi.slice(0, 100)}${
          content.isi.length > 100
            ? "…"
            : ""
        }`
      : "Belum ada isi",
    active: content.aktif,
    href: `/admin/konten/${content.id}`,
  }));

  return (
    <div>
      <AdminPageHeader
        eyebrow="Konten"
        title="Konten website"
        description="Kelola teks dan bagian konten yang digunakan pada landing page tanpa mengubah struktur frontend."
        action={
          <AdminButton href="/admin/konten/tambah">
            <Plus size={16} />
            Tambah konten
          </AdminButton>
        }
      />

      <CrudList
        items={items}
        addHref="/admin/konten/tambah"
        addLabel="Tambah konten"
        emptyTitle="Belum ada konten"
        emptyText="Tambahkan konten halaman untuk mulai mengelola isi website."
      />
    </div>
  );
}
