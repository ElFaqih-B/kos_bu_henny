import {
  BedDouble,
  Camera,
  CircleCheck,
  Sparkles,
} from "lucide-react";

import AvailabilityPanel from "@/components/admin/AvailabilityPanel";
import BranchPanel from "@/components/admin/BranchPanel";
import QuickAccess from "@/components/admin/QuickAccess";
import RoomTable from "@/components/admin/RoomTable";
import SummaryCard from "@/components/admin/SummaryCard";
import { adminServerGet } from "@/lib/admin-server-api";
import type {
  Cabang,
  Kamar,
  RingkasanAdmin,
} from "@/lib/types";

type DashboardBranch = {
  id: number;
  name: string;
  totalRooms: number;
  availableRooms: number;
};

async function getDashboardData() {
  const [summary, branches, rooms] =
    await Promise.all([
      adminServerGet<RingkasanAdmin>(
        "admin/ringkasan",
      ),
      adminServerGet<Cabang[]>("admin/cabang"),
      adminServerGet<Kamar[]>("admin/kamar"),
    ]);

  return {
    summary,
    branches: buildBranchSummary(
      branches,
      rooms,
    ),
    rooms: getRecentRooms(rooms),
  };
}

function buildBranchSummary(
  branches: Cabang[],
  rooms: Kamar[],
): DashboardBranch[] {
  return branches
    .filter((branch) => branch.aktif)
    .map((branch) => {
      const branchRooms = rooms.filter(
        (room) =>
          room.cabang_id === branch.id &&
          room.aktif,
      );

      return {
        id: branch.id,
        name: branch.nama,
        totalRooms: branchRooms.reduce(
          (sum, room) =>
            sum + room.jumlah_kamar,
          0,
        ),
        availableRooms: branchRooms.reduce(
          (sum, room) =>
            sum + room.kamar_tersedia,
          0,
        ),
      };
    });
}

function getRecentRooms(rooms: Kamar[]) {
  return [...rooms]
    .filter((room) => room.aktif)
    .sort((a, b) => b.id - a.id)
    .slice(0, 6)
    .map((room) => ({
      id: room.id,
      name: room.nama,
      branchName:
        room.cabang?.nama ??
        "Tidak ada cabang",
      price: room.harga_bulanan,
      size: room.ukuran ?? room.tipe,
      available: room.kamar_tersedia,
    }));
}

export default async function AdminDashboardPage() {
  const {
    summary,
    branches,
    rooms,
  } = await getDashboardData();

  const availability = branches.map(
    (branch) => ({
      name: branch.name,
      available: branch.availableRooms,
      total: branch.totalRooms,
    }),
  );

  return (
    <div className="w-full">
      <section className="grid grid-cols-2 gap-2.5 sm:gap-3.5 xl:grid-cols-4">
        <SummaryCard
          label="Tipe kamar"
          value={summary.jumlah_tipe_kamar}
          description="Tipe terdaftar"
          icon={BedDouble}
          tone="cream"
        />

        <SummaryCard
          label="Kamar tersedia"
          value={summary.jumlah_kamar_tersedia}
          description="Siap disewakan"
          icon={CircleCheck}
          tone="sage"
        />

        <SummaryCard
          label="Dokumentasi"
          value={summary.jumlah_dokumentasi}
          description="Media tersimpan"
          icon={Camera}
          tone="blue"
        />

        <SummaryCard
          label="Fasilitas"
          value={summary.jumlah_fasilitas}
          description="Terdaftar"
          icon={Sparkles}
          tone="rose"
        />
      </section>

      <section className="mt-3.5 grid items-start gap-3.5 xl:grid-cols-[minmax(0,1.55fr)_minmax(290px,.72fr)] xl:gap-4.5">
        <AvailabilityPanel
          branches={availability}
        />

        <BranchPanel
          branches={branches}
        />

        <RoomTable rooms={rooms} />

        <QuickAccess />
      </section>
    </div>
  );
}
