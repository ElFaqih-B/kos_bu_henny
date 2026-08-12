import { notFound } from "next/navigation";
import {
  BedDouble,
  Check,
  Edit3,
  ExternalLink,
  MapPin,
} from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminServerGetById,
} from "@/lib/admin-server-api";
import { mediaUrl } from "@/lib/media";
import type { Kamar } from "@/lib/types";

const rupiah = new Intl.NumberFormat(
  "id-ID",
  {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  },
);

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KamarDetailPage({
  params,
}: Props) {
  const { id } = await params;
  const room = await adminServerGetById<Kamar>(
    "admin/kamar",
    Number(id),
  );

  if (!room) {
    notFound();
  }

  const image = mediaUrl(room.url_gambar);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Detail kamar"
        title={room.nama}
        description="Periksa informasi kamar sebelum mengubah data yang tampil pada website."
        backHref="/admin/kamar"
        action={
          <AdminButton
            href={`/admin/kamar/${room.id}/edit`}
          >
            <Edit3 size={16} />
            Edit kamar
          </AdminButton>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,.7fr)]">
        <section className="overflow-hidden rounded-xl border border-(--line) bg-white">
          <div className="aspect-[16/9] bg-(--cream) sm:aspect-[2/1]">
            {image ? (
              <img
                src={image}
                alt={room.nama}
                className="size-full object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center text-(--stone)">
                <BedDouble size={36} />
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                label={room.tipe}
                tone="neutral"
              />
              <StatusBadge
                label={
                  room.aktif
                    ? "Aktif"
                    : "Nonaktif"
                }
                tone={
                  room.aktif
                    ? "success"
                    : "danger"
                }
              />
            </div>

            <h2 className="mt-3 font-(family-name:--font-fraunces) text-2xl tracking-tight">
              Tentang kamar
            </h2>

            <p className="mt-3 text-sm leading-7 text-(--stone)">
              {room.deskripsi ||
                "Belum ada deskripsi kamar."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <Info
                label="Harga"
                value={`${rupiah.format(room.harga_bulanan)} /${room.periode_harga}`}
              />
              <Info
                label="Ukuran"
                value={room.ukuran || "-"}
              />
              <Info
                label="Ketersediaan"
                value={`${room.kamar_tersedia} / ${room.jumlah_kamar}`}
              />
            </div>
          </div>
        </section>

        <aside className="grid content-start gap-4">
          <section className="rounded-xl border border-(--line) bg-white p-4 sm:p-5">
            <h2 className="font-(family-name:--font-fraunces) text-lg">
              Fasilitas
            </h2>

            {room.fasilitas.length > 0 ? (
              <div className="mt-4 grid gap-2">
                {room.fasilitas.map((facility) => (
                  <div
                    key={facility}
                    className="flex min-h-10 items-center gap-2.5 rounded-[9px] bg-(--cream)/55 px-3"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-(--accent)">
                      <Check size={13} />
                    </span>
                    <span className="text-xs font-medium">
                      {facility}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-(--stone)">
                Belum ada fasilitas.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-(--line) bg-white p-4 sm:p-5">
            <h2 className="font-(family-name:--font-fraunces) text-lg">
              Cabang
            </h2>

            <div className="mt-4 flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[9px] bg-(--cream) text-(--accent)">
                <MapPin size={17} />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {room.cabang?.nama ??
                    "Tidak ada cabang"}
                </p>

                {room.cabang?.alamat && (
                  <p className="mt-1 text-xs leading-5 text-(--stone)">
                    {room.cabang.alamat}
                    {room.cabang.kota
                      ? `, ${room.cabang.kota}`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            {room.cabang?.url_maps && (
              <a
                href={room.cabang.url_maps}
                target="_blank"
                rel="noreferrer"
                className="
                  mt-4 inline-flex min-h-10 w-full
                  items-center justify-center gap-2 rounded-[9px]
                  border border-(--line) text-xs font-semibold
                  transition hover:bg-(--cream)
                "
              >
                <MapPin size={15} />
                Buka Maps
                <ExternalLink size={13} />
              </a>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "success" | "danger";
}) {
  const classes = {
    neutral:
      "bg-(--cream) text-(--accent)",
    success:
      "bg-[#e9f2ec] text-[#47775f]",
    danger:
      "bg-[#f6e8e9] text-[#a44d55]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${classes[tone]}`}
    >
      {label}
    </span>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-[9px] bg-(--cream)/55 p-3">
      <p className="text-[9px] text-(--muted)">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-semibold leading-5">
        {value}
      </p>
    </div>
  );
}
