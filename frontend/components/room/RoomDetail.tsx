import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  Check,
  ExternalLink,
  MapPin,
  Maximize2,
  MessageCircle,
} from "lucide-react";

import RoomGallery from "@/components/room/RoomGallery";
import { rupiah } from "@/lib/format";
import type {
  Kamar,
  Pengaturan,
} from "@/lib/types";
import {
  buildRoomWhatsappUrl,
} from "@/lib/whatsapp";


type RoomDetailProps = {
  room: Kamar;
  settings: Pengaturan;
};


export default function RoomDetail({
  room,
  settings,
}: RoomDetailProps) {
  const whatsappUrl =
    buildRoomWhatsappUrl(
      room,
      settings.nomor_whatsapp,
    );

  const isAvailable =
    room.kamar_tersedia > 0;

  const branchName =
    room.cabang?.nama ??
    "Kos Omah Subardiman";

  const address = [
    room.cabang?.alamat,
    room.cabang?.kota,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 backdrop-blur-md">
        <div className="container-page flex h-17 items-center justify-between">
          <Link
            href="/#kamar"
            className="inline-flex items-center gap-2 text-sm font-medium text-(--ink) transition hover:text-(--accent)"
          >
            <ArrowLeft size={17} />
            <span>Kembali</span>
          </Link>

          <Link
            href="/"
            className="font-(family-name:--font-fraunces) text-lg font-semibold tracking-[-0.02em] text-(--ink)"
          >
            {settings.nama_kos}
          </Link>
        </div>
      </header>

      <main>
        {/* Detail */}
        <section className="py-7 sm:py-10 lg:py-14">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start lg:gap-12">
              {/* Gallery and description */}
              <div className="min-w-0">
                <RoomGallery
                  roomName={room.nama}
                  coverUrl={room.url_gambar}
                  photos={room.foto ?? []}
                />

                {/* Description */}
                <div className="mt-9 border-t border-(--line) pt-8">
                  <h2 className="text-2xl tracking-tight text-(--ink)">
                    Tentang kamar
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-(--stone) sm:text-base sm:leading-8">
                    {room.deskripsi ||
                      `${room.nama} merupakan salah satu pilihan kamar di ${branchName}. Hubungi pengelola untuk memastikan ketersediaannya.`}
                  </p>
                </div>

                {/* Facilities */}
                <div className="mt-9 border-t border-(--line) pt-8">
                  <h2 className="text-2xl tracking-tight text-(--ink)">
                    Fasilitas kamar
                  </h2>

                  {room.fasilitas.length > 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {room.fasilitas.map(
                        (facility) => (
                          <div
                            key={facility}
                            className="flex min-h-14 items-center gap-3 rounded-[10px] border border-(--line) bg-white px-4 py-3"
                          >
                            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--cream) text-(--accent)">
                              <Check size={16} />
                            </div>

                            <span className="text-sm font-medium text-(--ink)">
                              {facility}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-(--stone)">
                      Informasi fasilitas belum
                      tersedia.
                    </p>
                  )}
                </div>
              </div>

              {/* Information card */}
              <aside className="lg:sticky lg:top-24">
                <div className="rounded-[10px] border border-(--line) bg-white p-5 sm:p-6">
                  <p className="text-sm font-medium text-(--accent)">
                    {room.tipe}
                  </p>

                  <h1 className="mt-2 text-[clamp(2rem,7vw,3rem)] leading-[1.05] tracking-[-0.035em] text-(--ink)">
                    {room.nama}
                  </h1>

                  <div className="mt-6 rounded-[10px] bg-(--cream) p-4">
                    <p className="text-xs text-(--stone)">
                      Harga
                    </p>

                    <div className="mt-1 flex flex-wrap items-end gap-x-1.5">
                      <strong className="text-2xl text-(--ink)">
                        {rupiah(
                          room.harga_bulanan,
                        )}
                      </strong>

                      <span className="pb-0.5 text-sm text-(--stone)">
                        /{room.periode_harga}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <InfoItem
                      icon={BedDouble}
                      label="Ketersediaan"
                      value={
                        isAvailable
                          ? `${room.kamar_tersedia} kamar`
                          : "Penuh"
                      }
                    />

                    <InfoItem
                      icon={Maximize2}
                      label="Ukuran"
                      value={
                        room.ukuran || "-"
                      }
                    />
                  </div>

                  <div className="mt-3 rounded-[10px] border border-(--line) p-4">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-(--accent)"
                      />

                      <div className="min-w-0">
                        <p className="font-semibold text-(--ink)">
                          {branchName}
                        </p>

                        {address && (
                          <p className="mt-1 text-sm leading-6 text-(--stone)">
                            {address}
                          </p>
                        )}

                        {room.cabang?.patokan && (
                          <p className="mt-2 text-xs leading-5 text-(--stone)">
                            Patokan:{" "}
                            {room.cabang.patokan}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-(--accent) px-5 text-sm font-semibold text-white! transition hover:brightness-90"
                    >
                      <MessageCircle size={18} />
                      Tanya ketersediaan
                    </a>
                  ) : (
                    <div className="mt-5 rounded-[10px] bg-(--cream) p-4 text-center text-sm text-(--stone)">
                      Nomor WhatsApp belum tersedia.
                    </div>
                  )}

                  {room.cabang?.url_maps && (
                    <a
                      href={room.cabang.url_maps}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-(--line) px-5 text-sm font-semibold text-(--ink) transition hover:border-(--accent) hover:text-(--accent)"
                    >
                      <MapPin size={17} />
                      Buka Google Maps
                      <ExternalLink size={14} />
                    </a>
                  )}

                  <p className="mt-5 text-center text-xs leading-5 text-(--stone)">
                    Ketersediaan kamar dapat berubah.
                    Hubungi pengelola untuk memastikan
                    informasi terbaru.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


type InfoItemProps = {
  icon: typeof BedDouble;
  label: string;
  value: string;
};


function InfoItem({
  icon: Icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="rounded-[10px] border border-(--line) p-4">
      <Icon
        size={18}
        className="text-(--accent)"
      />

      <p className="mt-3 text-xs text-(--stone)">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-(--ink)">
        {value}
      </p>
    </div>
  );
}