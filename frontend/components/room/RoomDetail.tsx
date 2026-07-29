import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  Check,
  CircleCheck,
  CircleX,
  ExternalLink,
  MapPin,
  Maximize2,
  MessageCircle,
} from "lucide-react";

import { mediaUrl } from "@/lib/media";
import {
  buildRoomWhatsappUrl,
} from "@/lib/whatsapp";

import type {
  Kamar,
  Pengaturan,
} from "@/lib/types";

type RoomDetailProps = {
  room: Kamar;
  settings: Pengaturan;
};


function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}


export default function RoomDetail({
  room,
  settings,
}: RoomDetailProps) {
  const branch = room.cabang;

const whatsappUrl =
  buildRoomWhatsappUrl(
    room,
    settings.nomor_whatsapp,
  );

  const imageUrl =
    room.url_gambar
      ? mediaUrl(room.url_gambar)
      : null;

  const available =
    room.kamar_tersedia > 0;

  return (
    <main className="min-h-screen bg-white text-(--ink)">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/8 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className="font-semibold tracking-[-0.02em] text-(--ink)"
          >
            {settings.nama_kos}
          </Link>

          <Link
            href="/#kamar"
            className="
              flex min-h-10 items-center gap-2
              rounded-lg
              bg-white px-3.5
              text-sm font-medium
              text-(--ink-soft)
              transition
              hover:border-(--line-strong)
              hover:bg-(--cream)
              hover:text-(--ink)
            "
          >
            <ArrowLeft size={16} />
            kembali
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-7 py-7 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">

          {/* Left */}
          <div>
            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden rounded-[10px] bg-(--parchment) md:aspect-5/4">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={room.nama}
                  fill
                  priority
                  sizes="
                    (max-width: 1024px) 100vw,
                    58vw
                  "
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BedDouble
                    size={48}
                    strokeWidth={1.25}
                    className="text-black/20"
                  />
                </div>
              )}

              {/* Availability Badge */}
              <div
                className={`
                  absolute left-4 top-4
                  inline-flex items-center gap-2
                  rounded-lg bg-white/95
                  px-3 py-2
                  text-xs font-semibold
                  shadow-[0_4px_14px_rgba(50,45,41,0.10)]
                  backdrop-blur-sm
                  ${
                    available
                      ? "text-(--ink)"
                      : "text-(--accent)"
                  }
                `}
              >
                {available ? (
                  <CircleCheck size={15} />
                ) : (
                  <CircleX size={15} />
                )}

                {available
                  ? `${room.kamar_tersedia} kamar tersedia`
                  : "Sedang penuh"}
              </div>
            </div>

            {/* Description */}
            <section className="mt-8 border-t border-black/8 pt-7">
              <h2 className="font-serif text-2xl tracking-tight">
                Tentang kamar
              </h2>

              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-black/60">
                {room.deskripsi ||
                  "Informasi deskripsi kamar belum tersedia."}
              </p>
            </section>

            {/* Facilities */}
            <section className="mt-8 border-t border-black/8 pt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl tracking-tight">
                    Fasilitas
                  </h2>

                  <p className="mt-1 text-sm text-black/50">
                    Fasilitas yang tersedia pada kamar ini.
                  </p>
                </div>

                <span className="shrink-0 text-sm font-medium text-black/45">
                  {room.fasilitas.length} fasilitas
                </span>
              </div>

              {room.fasilitas.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {room.fasilitas.map(
                    (facility) => (
                      <div
                        key={facility}
                        className="
                          flex min-h-14
                          items-center gap-3
                          rounded-lg
                          border border-black/7
                          bg-black/2
                          px-3.5 py-3
                          text-sm
                        "
                      >
                        <div
                          className="
                            flex size-8 shrink-0
                            items-center justify-center
                            rounded-md
                            bg-white
                            text-(--accent)
                            shadow-[0_1px_4px_rgba(50,45,41,0.06)]
                          "
                        >
                          <Check
                            size={15}
                            strokeWidth={2.2}
                          />
                        </div>

                        <span className="leading-5">
                          {facility}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-lg bg-black/3 px-4 py-4">
                  <p className="text-sm text-black/50">
                    Informasi fasilitas belum tersedia.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            {/* Information Card */}
            <div
              className="
                rounded-[10px]
                border border-black/10
                bg-white
                p-5
                shadow-[0_8px_28px_rgba(50,45,41,0.05)]
                sm:p-6
                md:p-7
              "
            >
              {/* Branch */}
              <div className="flex items-center gap-2 text-sm font-medium text-(--accent)">
                <MapPin size={16} />

                <span>
                  {branch?.nama ??
                    "Kos Bu Henny"}
                </span>
              </div>

              {/* Title */}
              <div className="mt-4">
                <p className="text-sm text-black/45">
                  {room.tipe}
                </p>

                <h1 className="mt-1 font-serif text-[clamp(2rem,5vw,3.35rem)] leading-[1.03] tracking-[-0.035em]">
                  {room.nama}
                </h1>
              </div>

              {/* Price */}
              <div className="mt-7 rounded-lg bg-(--cream) px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/40">
                  Harga
                </p>

                <div className="mt-1 flex flex-wrap items-end gap-1.5">
                  <span className="font-serif text-3xl tracking-[-0.03em] text-(--accent)">
                    {formatPrice(
                      room.harga_bulanan,
                    )}
                  </span>

                  <span className="pb-1 text-sm text-black/45">
                    /{room.periode_harga}
                  </span>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-black/8 px-4 py-4">
                  <div className="flex items-center gap-2 text-black/45">
                    <Maximize2 size={16} />

                    <span className="text-xs font-medium uppercase tracking-widest">
                      Ukuran
                    </span>
                  </div>

                  <p className="mt-2 font-medium">
                    {room.ukuran ||
                      "Belum tersedia"}
                  </p>
                </div>

                <div className="rounded-lg border border-black/8 px-4 py-4">
                  <div className="flex items-center gap-2 text-black/45">
                    <BedDouble size={16} />

                    <span className="text-xs font-medium uppercase tracking-widest">
                      Total
                    </span>
                  </div>

                  <p className="mt-2 font-medium">
                    {room.jumlah_kamar} kamar
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="mt-3 rounded-lg border border-black/8 px-4 py-4">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-black/40">
                      Ketersediaan
                    </p>

                    <p className="mt-2 text-sm font-medium leading-5">
                      {available
                        ? `${room.kamar_tersedia} dari ${room.jumlah_kamar} kamar tersedia`
                        : "Kamar sedang penuh"}
                    </p>
                  </div>

                  <span
                    className={`
                      mt-1.5 size-2.5
                      shrink-0 rounded-full
                      ${
                        available
                          ? "bg-emerald-600"
                          : "bg-(--accent)"
                      }
                    `}
                  />
                </div>
              </div>

              {/* WhatsApp */}
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    mt-5 flex min-h-12 w-full
                    items-center justify-center
                    gap-2 rounded-lg
                    bg-(--accent)
                    px-5 py-3
                    text-sm font-semibold
                    text-white!
                    transition
                    hover:bg-(--accent-dark)
                  "
                >
                  <MessageCircle size={18} />

                  {available
                    ? "Tanya kamar via WhatsApp"
                    : "Tanya ketersediaan berikutnya"}
                </a>
              ) : (
                <div
                  className="
                    mt-5 flex min-h-12
                    items-center justify-center
                    rounded-lg
                    bg-black/5
                    px-5 text-center
                    text-sm text-black/45
                  "
                >
                  Nomor WhatsApp belum tersedia
                </div>
              )}

              {/* Location */}
              {branch && (
                <div className="mt-6 border-t border-black/8 pt-6">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      className="text-(--accent)"
                    />

                    <p className="text-xs font-medium uppercase tracking-widest text-black/40">
                      Lokasi cabang
                    </p>
                  </div>

                  <p className="mt-3 font-medium">
                    {branch.nama}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-black/55">
                    {branch.alamat}
                  </p>

                  {branch.patokan && (
                    <p className="mt-2 text-sm text-black/45">
                      Patokan: {branch.patokan}
                    </p>
                  )}

                  {branch.url_maps && (
                    <a
                      href={branch.url_maps}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        mt-4 inline-flex
                        items-center gap-2
                        rounded-md
                        text-sm font-semibold
                        text-(--accent)
                        transition
                        hover:text-(--accent-dark)
                      "
                    >
                      Buka di Google Maps
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Note */}
            <div
              className="
                mt-4 flex gap-3
                rounded-[10px]
                bg-(--cream)
                p-4
              "
            >
              <CircleCheck
                size={18}
                className="mt-0.5 shrink-0 text-(--accent)"
              />

              <p className="text-xs leading-5 text-black/50">
                Informasi harga dan ketersediaan
                ditampilkan berdasarkan data terbaru.
                Konfirmasikan kembali melalui WhatsApp
                sebelum datang ke lokasi.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}