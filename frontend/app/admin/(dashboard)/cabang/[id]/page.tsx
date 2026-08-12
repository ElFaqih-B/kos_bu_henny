import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminServerGet,
  adminServerGetById,
} from "@/lib/admin-server-api";
import type {
  Cabang,
  Kamar,
} from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CabangDetail({
  params,
}: Props) {
  const { id } = await params;
  const branchId = Number(id);

  const [branch, rooms] = await Promise.all([
    adminServerGetById<Cabang>(
      "admin/cabang",
      branchId,
    ),
    adminServerGet<Kamar[]>("admin/kamar"),
  ]);

  if (!branch) {
    notFound();
  }

  const branchRooms = rooms.filter(
    (room) => room.cabang_id === branch.id,
  );

  return (
    <div>
      <AdminPageHeader
        eyebrow="Detail cabang"
        title={branch.nama}
        description="Informasi lokasi dan kamar yang berada di cabang ini."
        backHref="/admin/cabang"
        action={
          <AdminButton
            href={`/admin/cabang/${branch.id}/edit`}
          >
            Edit cabang
          </AdminButton>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <section className="rounded-xl border border-(--line) bg-white p-4 sm:p-5">
          <div className="grid size-12 place-items-center rounded-[10px] bg-(--cream) text-(--accent)">
            <MapPin size={20} />
          </div>

          <h2 className="mt-4 font-(family-name:--font-fraunces) text-xl">
            Lokasi
          </h2>

          <p className="mt-2 text-sm leading-6 text-(--stone)">
            {branch.alamat}
            {branch.kota
              ? `, ${branch.kota}`
              : ""}
          </p>

          {branch.patokan && (
            <p className="mt-3 text-xs text-(--stone)">
              Patokan: {branch.patokan}
            </p>
          )}

          {branch.deskripsi && (
            <p className="mt-5 border-t border-(--line) pt-5 text-sm leading-7 text-(--stone)">
              {branch.deskripsi}
            </p>
          )}

          <div className="mt-5 grid gap-2">
            {branch.nomor_whatsapp && (
              <a
                href={`https://wa.me/${branch.nomor_whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="
                inline-flex min-h-11 items-center gap-2
                rounded-[9px] border border-(--line) px-3
                text-xs font-semibold transition hover:bg-(--cream)
              "
              >
                <Phone size={15} />
                WhatsApp
              </a>
            )}

            {branch.url_maps && (
              <a
                href={branch.url_maps}
                target="_blank"
                rel="noreferrer"
                className="
                inline-flex min-h-11 items-center gap-2
                rounded-[9px] border border-(--line) px-3
                text-xs font-semibold transition hover:bg-(--cream)
              "
              >
                <MapPin size={15} />
                Google Maps
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-(--line) bg-white">
          <div className="border-b border-(--line) px-4 py-4 sm:px-5">
            <h2 className="font-(family-name:--font-fraunces) text-lg">
              Kamar di cabang ini
            </h2>
            <p className="mt-1 text-[11px] text-(--muted)">
              {branchRooms.length} tipe kamar
            </p>
          </div>

          {branchRooms.length > 0 ? (
            <div className="divide-y divide-(--line)">
              {branchRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/admin/kamar/${room.id}`}
                  className="flex min-h-16 items-center gap-3 px-4 py-3 transition hover:bg-(--cream)/40 sm:px-5"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-(--cream) text-(--accent)">
                    <MapPin size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-xs">
                      {room.nama}
                    </strong>
                    <span className="mt-1 block text-[10px] text-(--muted)">
                      {room.kamar_tersedia} dari {room.jumlah_kamar} tersedia
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-semibold">
                    Rp {room.harga_bulanan.toLocaleString("id-ID")}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-xs text-(--stone)">
              Belum ada kamar di cabang ini.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
