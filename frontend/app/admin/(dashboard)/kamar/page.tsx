import Link from "next/link";
import {
  BedDouble,
  Building2,
  ChevronRight,
  Plus,
} from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminServerGet } from "@/lib/admin-server-api";
import type { Kamar } from "@/lib/types";
import { rupiah } from "@/lib/format";


export default async function KamarPage() {
  const rooms = await adminServerGet<Kamar[]>(
    "admin/kamar",
  );

  const activeRooms = rooms.filter(
    (room) => room.aktif,
  );

  const totalUnits = rooms.reduce(
    (sum, room) =>
      sum + room.jumlah_kamar,
    0,
  );

  const availableUnits = rooms.reduce(
    (sum, room) =>
      sum + room.kamar_tersedia,
    0,
  );

  return (
    <div>
      <AdminPageHeader
        eyebrow="Manajemen"
        title="Kamar"
        description="
          Kelola kamar yang tampil pada website.
        "
        action={
          <AdminButton href="/admin/kamar/tambah">
            <Plus size={16} />
            Tambah kamar
          </AdminButton>
        }
      />

      <section className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3.5">
        <MiniSummary
          label="Data"
          value={rooms.length}
          note="tipe kamar"
        />
        <MiniSummary
          label="Unit"
          value={totalUnits}
          note="total kamar"
        />
        <MiniSummary
          label="Tersedia"
          value={availableUnits}
          note="siap disewakan"
        />
        <MiniSummary
          label="Aktif"
          value={activeRooms.length}
          note={`${rooms.length - activeRooms.length} nonaktif`}
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-(--line) bg-white">
        <div className="flex min-h-17 items-center justify-between gap-3 border-b border-(--line) px-4 py-4 sm:px-5">
          <div>
            <h2 className="font-(family-name:--font-fraunces) text-lg">
              Daftar kamar
            </h2>
            <p className="mt-1 text-[11px] text-(--muted)">
              {rooms.length} data terdaftar
            </p>
          </div>

          <Link
            href="/admin"
            className="text-[11px] font-bold text-(--accent)"
          >
            Dashboard
          </Link>
        </div>

        {rooms.length > 0 ? (
          <>
            <div className="divide-y divide-(--line) md:hidden">
              {rooms.map((room) => (
                <MobileRoomCard
                  key={room.id}
                  room={room}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-205 border-collapse">
                <thead>
                  <tr className="border-b border-(--line) bg-(--cream)/40 text-left">
                    <TableHeading>Kamar</TableHeading>
                    <TableHeading>Cabang</TableHeading>
                    <TableHeading>Harga</TableHeading>
                    <TableHeading>Ketersediaan</TableHeading>
                    <TableHeading>Status</TableHeading>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <DesktopRoomRow
                      key={room.id}
                      room={room}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}

function MobileRoomCard({
  room,
}: {
  room: Kamar;
}) {
  const availability = getAvailability(
    room,
  );

  return (
    <Link
      href={`/admin/kamar/${room.id}`}
      className="block px-4 py-4 transition active:bg-(--cream)/50"
    >
      <div className="flex items-start gap-3">
        <RoomIcon />

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold">
                {room.nama}
              </h3>
              <p className="mt-1 text-[11px] text-(--muted)">
                {room.tipe}
                {room.ukuran
                  ? ` · ${room.ukuran}`
                  : ""}
              </p>
            </div>

            <ChevronRight
              size={17}
              className="mt-0.5 shrink-0 text-(--stone)"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <InfoTile
              label="Cabang"
              value={room.cabang?.nama ?? "-"}
            />
            <InfoTile
              label="Harga"
              value={rupiah(
                room.harga_bulanan,
              )}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <StatusBadge
              label={availability.label}
              tone={availability.tone}
            />
            <span className="text-[10px] text-(--muted)">
              {room.kamar_tersedia} dari {room.jumlah_kamar} tersedia
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DesktopRoomRow({
  room,
}: {
  room: Kamar;
}) {
  const availability = getAvailability(
    room,
  );

  return (
    <tr className="border-b border-(--line) last:border-0 hover:bg-[#fcfbf9]">
      <td className="px-5 py-4">
        <Link
          href={`/admin/kamar/${room.id}`}
          className="flex items-center gap-3"
        >
          <RoomIcon />
          <span>
            <strong className="block text-sm">
              {room.nama}
            </strong>
            <span className="mt-0.5 block text-xs text-(--stone)">
              {room.tipe}
              {room.ukuran
                ? ` · ${room.ukuran}`
                : ""}
            </span>
          </span>
        </Link>
      </td>

      <td className="px-5 py-4">
        <span className="flex items-center gap-2 text-sm">
          <Building2
            size={15}
            className="text-(--stone)"
          />
          {room.cabang?.nama ?? "-"}
        </span>
      </td>

      <td className="px-5 py-4">
        <span className="whitespace-nowrap text-sm font-semibold">
          {rupiah(room.harga_bulanan)}
        </span>
        <span className="mt-0.5 block text-xs text-(--stone)">
          /{room.periode_harga}
        </span>
      </td>

      <td className="px-5 py-4 text-sm">
        {room.kamar_tersedia} / {room.jumlah_kamar}
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          label={availability.label}
          tone={availability.tone}
        />
      </td>

      <td className="px-4 py-4">
        <Link
          href={`/admin/kamar/${room.id}`}
          aria-label={`Kelola ${room.nama}`}
          className="grid size-9 place-items-center rounded-lg transition hover:bg-(--cream)"
        >
          <ChevronRight size={16} />
        </Link>
      </td>
    </tr>
  );
}

function RoomIcon() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-(--cream) text-(--accent)">
      <BedDouble size={18} />
    </span>
  );
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-[9px] bg-(--cream)/55 p-2.5">
      <p className="text-[9px] text-(--muted)">
        {label}
      </p>
      <p className="mt-1 truncate text-[11px] font-semibold">
        {value}
      </p>
    </div>
  );
}

function getAvailability(room: Kamar) {
  if (room.jumlah_kamar <= 0) {
    return {
      label: "Belum diatur",
      tone: "bg-[#eeeae5] text-(--stone)",
    };
  }

  if (room.kamar_tersedia <= 0) {
    return {
      label: "Penuh",
      tone: "bg-[#f6e8e9] text-[#a44d55]",
    };
  }

  if (
    room.kamar_tersedia <=
    Math.max(
      Math.floor(room.jumlah_kamar * 0.25),
      1,
    )
  ) {
    return {
      label: "Terbatas",
      tone: "bg-[#f7eee1] text-[#a46f34]",
    };
  }

  return {
    label: "Tersedia",
    tone: "bg-[#e9f2ec] text-[#47775f]",
  };
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: string;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${tone}`}
    >
      {label}
    </span>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-(--stone)">
      {children}
    </th>
  );
}

function MiniSummary({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <article className="min-h-24.5 rounded-xl border border-(--line) bg-white p-3.5 sm:min-h-28 sm:p-4">
      <p className="text-[10px] text-(--stone)">
        {label}
      </p>
      <strong className="mt-1 block font-(family-name:--font-fraunces) text-[24px] leading-none tracking-[-0.02em]">
        {value}
      </strong>
      <p className="mt-2 text-[9px] text-(--stone)">
        {note}
      </p>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-14 text-center">
      <BedDouble
        size={28}
        className="mx-auto text-(--stone)"
      />
      <p className="mt-3 text-sm font-semibold">
        Belum ada data kamar
      </p>
      <p className="mt-1 text-xs text-(--stone)">
        Tambahkan kamar pertama untuk mulai
        mengelola website.
      </p>
      <Link
        href="/admin/kamar/tambah"
        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-[9px] bg-(--ink) px-4 text-xs font-semibold text-white"
      >
        <Plus size={15} />
        Tambah kamar
      </Link>
    </div>
  );
}
