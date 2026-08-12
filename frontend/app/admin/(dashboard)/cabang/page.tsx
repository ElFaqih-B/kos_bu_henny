import { Plus } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CrudList from "@/components/admin/CrudList";
import { adminServerGet } from "@/lib/admin-server-api";
import type {
  Cabang,
  Kamar,
} from "@/lib/types";

export default async function CabangPage() {
  const [branches, rooms] =
    await Promise.all([
      adminServerGet<Cabang[]>("admin/cabang"),
      adminServerGet<Kamar[]>("admin/kamar"),
    ]);

  const items = branches.map((branch) => {
    const branchRooms = rooms.filter(
      (room) => room.cabang_id === branch.id,
    );

    const total = branchRooms.reduce(
      (sum, room) =>
        sum + room.jumlah_kamar,
      0,
    );

    const available = branchRooms.reduce(
      (sum, room) =>
        sum + room.kamar_tersedia,
      0,
    );

    return {
      id: branch.id,
      title: branch.nama,
      subtitle: [
        branch.alamat,
        branch.kota,
      ]
        .filter(Boolean)
        .join(", "),
      meta: `${total} kamar · ${available} tersedia`,
      active: branch.aktif,
      href: `/admin/cabang/${branch.id}`,
    };
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Manajemen"
        title="Cabang"
        description="Kelola lokasi kos, alamat, kontak, dan cabang yang ditampilkan pada website."
        action={
          <AdminButton href="/admin/cabang/tambah">
            <Plus size={16} />
            Tambah cabang
          </AdminButton>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Stat
          label="Cabang"
          value={branches.length}
        />
        <Stat
          label="Aktif"
          value={branches.filter(
            (branch) => branch.aktif,
          ).length}
        />
        <Stat
          label="Kota"
          value={
            new Set(
              branches
                .map((branch) => branch.kota)
                .filter(Boolean),
            ).size
          }
        />
      </div>

      <CrudList
        items={items}
        addHref="/admin/cabang/tambah"
        addLabel="Tambah cabang"
        emptyTitle="Belum ada cabang"
        emptyText="Tambahkan lokasi pertama untuk mengatur kamar dan informasi kontak."
        deletePath="admin/cabang"
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
