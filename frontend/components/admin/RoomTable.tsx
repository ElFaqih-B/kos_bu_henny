import {
  BedDouble,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

export type Room = {
  id: number;
  name: string;
  branchName: string;
  price: number;
  size: string;
  available: number;
};

type Props = {
  rooms: Room[];
};

const rupiah = new Intl.NumberFormat(
  "id-ID",
  {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  },
);

export default function RoomTable({
  rooms,
}: Props) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-(--line) bg-white">
      <div className="flex min-h-[70px] items-center gap-3 border-b border-[#eeeae5] px-4 py-4 sm:px-4.5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-lg tracking-tight">
            Kamar Terbaru
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Akses cepat ke data kamar.
          </p>
        </div>

        <Link
          href="/admin/kamar"
          className="ml-auto rounded-lg px-2.5 py-2 text-[11px] font-bold text-(--accent) transition hover:bg-(--cream)"
        >
          Lihat semua
        </Link>
      </div>

      {rooms.length > 0 ? (
        <>
          <div className="divide-y divide-(--line) md:hidden">
            {rooms.map((room) => (
              <MobileRoomRow
                key={room.id}
                room={room}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-[#eeeae5]">
                  <TableHeading>Kamar</TableHeading>
                  <TableHeading>Cabang</TableHeading>
                  <TableHeading>Harga</TableHeading>
                  <TableHeading>Ketersediaan</TableHeading>
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
        <Empty />
      )}
    </article>
  );
}

function MobileRoomRow({
  room,
}: {
  room: Room;
}) {
  return (
    <Link
      href={`/admin/kamar/${room.id}`}
      className="flex min-h-[76px] items-center gap-3 px-4 py-3 transition hover:bg-(--cream)/40"
    >
      <RoomIcon />

      <span className="min-w-0 flex-1">
        <strong className="block truncate text-xs">
          {room.name}
        </strong>
        <span className="mt-1 block truncate text-[10px] text-(--muted)">
          {room.branchName} · {rupiah.format(room.price)}
        </span>
      </span>

      <AvailabilityBadge
        available={room.available}
      />
    </Link>
  );
}

function DesktopRoomRow({
  room,
}: {
  room: Room;
}) {
  return (
    <tr className="border-b border-[#f0ece8] last:border-0 hover:bg-[#fcfbf9]">
      <td className="px-4 py-3">
        <Link
          href={`/admin/kamar/${room.id}`}
          className="flex items-center gap-2.5"
        >
          <RoomIcon />
          <span>
            <strong className="block text-[11px]">
              {room.name}
            </strong>
            <span className="text-[9px] text-(--muted)">
              {room.size}
            </span>
          </span>
        </Link>
      </td>

      <td className="px-4 py-3">
        {room.branchName}
      </td>

      <td className="whitespace-nowrap px-4 py-3">
        {rupiah.format(room.price)}
      </td>

      <td className="px-4 py-3">
        <AvailabilityBadge
          available={room.available}
        />
      </td>

      <td className="px-4 py-3">
        <Link
          href={`/admin/kamar/${room.id}`}
          aria-label={`Buka ${room.name}`}
          className="grid size-8 place-items-center rounded-lg transition hover:bg-(--cream)"
        >
          <MoreHorizontal size={15} />
        </Link>
      </td>
    </tr>
  );
}

function RoomIcon() {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-(--cream) text-(--accent)">
      <BedDouble size={16} />
    </span>
  );
}

function AvailabilityBadge({
  available,
}: {
  available: number;
}) {
  const className =
    available === 0
      ? "bg-[#f6e8e9] text-[#a44d55]"
      : available === 1
        ? "bg-[#f7eee1] text-[#a46f34]"
        : "bg-[#e9f2ec] text-[#47775f]";

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${className}`}
    >
      {available > 0
        ? `${available} tersedia`
        : "Penuh"}
    </span>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 text-left font-semibold text-(--muted)">
      {children}
    </th>
  );
}

function Empty() {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium">
        Belum ada data kamar.
      </p>
      <Link
        href="/admin/kamar/tambah"
        className="mt-2 inline-block text-xs font-semibold text-(--accent)"
      >
        Tambah kamar
      </Link>
    </div>
  );
}
