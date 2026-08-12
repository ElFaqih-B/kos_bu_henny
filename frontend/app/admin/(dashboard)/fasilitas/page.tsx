import { Plus } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CrudList from "@/components/admin/CrudList";
import { adminServerGet } from "@/lib/admin-server-api";
import type { Fasilitas } from "@/lib/types";

export default async function FasilitasPage() {
  const facilities =
    await adminServerGet<Fasilitas[]>(
      "admin/fasilitas",
    );

  const items = facilities.map((facility) => ({
    id: facility.id,
    title: facility.nama,
    subtitle:
      facility.deskripsi ?? facility.kategori,
    meta: `Kategori: ${facility.kategori}`,
    active: facility.aktif,
    href: `/admin/fasilitas/${facility.id}`,
  }));

  return (
    <div>
      <AdminPageHeader
        eyebrow="Manajemen"
        title="Fasilitas"
        description="Kelola fasilitas yang dapat digunakan pada data kamar dan ditampilkan kepada calon penghuni."
        action={
          <AdminButton href="/admin/fasilitas/tambah">
            <Plus size={16} />
            Tambah fasilitas
          </AdminButton>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Stat
          label="Fasilitas"
          value={facilities.length}
        />
        <Stat
          label="Aktif"
          value={facilities.filter(
            (facility) => facility.aktif,
          ).length}
        />
        <Stat
          label="Kategori"
          value={
            new Set(
              facilities.map(
                (facility) => facility.kategori,
              ),
            ).size
          }
        />
      </div>

      <CrudList
        items={items}
        addHref="/admin/fasilitas/tambah"
        addLabel="Tambah fasilitas"
        emptyTitle="Belum ada fasilitas"
        emptyText="Tambahkan fasilitas pertama agar data kamar lebih informatif."
        deletePath="admin/fasilitas"
      />
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-xl border border-(--line) bg-white p-4">
      <p className="text-[10px] text-(--stone)">
        {label}
      </p>
      <strong className="mt-1 block font-(family-name:--font-fraunces) text-2xl">
        {value}
      </strong>
    </article>
  );
}
