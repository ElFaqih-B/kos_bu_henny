import Image from "next/image";
import {
  BedDouble,
  CheckCircle2,
  CircleX,
  MapPin,
  Maximize2,
  MessageCircle,
} from "lucide-react";

import { rupiah } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { buildRoomWhatsappUrl } from "@/lib/whatsapp";
import type { Kamar } from "@/lib/types";

type RoomCardProps = {
  room: Kamar;
  whatsappNumber?: string | null;
  desktop?: boolean;
  onDetail?: () => void;
};

export default function RoomCard({
  room,
  whatsappNumber,
  desktop = false,
  onDetail,
}: RoomCardProps) {
  const image = mediaUrl(room.url_gambar);

  const total = Math.max(room.jumlah_kamar, 0);
  const available = Math.max(
    Math.min(room.kamar_tersedia, total),
    0,
  );

  const isFull = total > 0 && available === 0;

  const bookingUrl = buildRoomWhatsappUrl(
    room,
    whatsappNumber,
  );

  const branchName =
    room.cabang?.nama ?? "Kos Omah Subardiman";

  const imageContent = image ? (
    <button
      type="button"
      onClick={onDetail}
      aria-label={`Lihat detail ${room.nama}`}
      className="relative block h-full w-full text-left"
    >
      <Image
        src={image}
        alt={room.nama}
        fill
        unoptimized
        sizes={desktop ? "33vw" : "84vw"}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </button>
  ) : (
    <div className="grid h-full place-items-center text-(--stone)">
      <div className="flex flex-col items-center gap-1.5">
        <BedDouble size={24} />
        <span className="text-xs">
          Foto belum tersedia
        </span>
      </div>
    </div>
  );

  const availability = isFull ? (
    <div className="flex items-center gap-1.5 text-red-700">
      <CircleX size={15} />
      <span>Kamar penuh</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5 text-emerald-700">
      <CheckCircle2 size={15} />
      <span>{available} kamar masih tersedia</span>
    </div>
  );

  if (desktop) {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-(--line) bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(50,45,41,0.10)]">
        <div className="relative aspect-4/3 bg-(--cream)">
          {imageContent}

          <span
            className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-semibold ${
              isFull
                ? "bg-(--ink) text-white"
                : "bg-white/92 text-(--ink)"
            }`}
          >
            {isFull
              ? "Penuh"
              : `${available} tersedia`}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-xl font-semibold leading-tight text-(--ink)">
                {room.nama}
              </h3>

              <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-xs text-(--stone)">
                <MapPin
                  size={13}
                  className="shrink-0"
                />
                <span className="truncate">
                  {branchName}
                </span>
              </p>
            </div>

            {room.ukuran && (
              <span className="flex shrink-0 items-center gap-1 text-xs text-(--stone)">
                <Maximize2 size={13} />
                {room.ukuran}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-1">
            <strong className="font-(family-name:--font-fraunces) text-2xl font-semibold tracking-tight text-(--accent)">
              {rupiah(room.harga_bulanan)}
            </strong>

            <span className="text-xs text-(--stone)">
              /{room.periode_harga}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-(--stone)">
            {room.ukuran && (
              <span className="flex items-center gap-1.5">
                <Maximize2 size={13} />
                {room.ukuran}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <BedDouble size={13} />
              {room.tipe}
            </span>
          </div>

          <div className="mt-4 text-sm font-semibold">
            {availability}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
            <button
              type="button"
              onClick={onDetail}
              className="flex h-11 w-full min-w-0 items-center justify-center rounded-[9px] border border-(--line) bg-white px-3 text-sm font-semibold leading-none text-(--ink) transition hover:border-(--accent) hover:text-(--accent)"
            >
              Detail
            </button>

            {bookingUrl ? (
              <a
                href={isFull ? undefined : bookingUrl}
                target={isFull ? undefined : "_blank"}
                rel={isFull ? undefined : "noreferrer"}
                aria-disabled={isFull}
                className={`flex h-11 w-full min-w-0 items-center justify-center gap-1.5 rounded-[9px] px-3 text-sm font-semibold leading-none ${
                  isFull
                    ? "pointer-events-none bg-(--neutral) text-(--stone)"
                    : "bg-(--accent) text-white! transition hover:brightness-90"
                }`}
              >
                <MessageCircle size={16} />
                {isFull ? "Penuh" : "Tanya"}
              </a>
            ) : (
              <div className="flex h-11 w-full min-w-0 items-center justify-center rounded-[9px] bg-(--cream) px-3 text-xs text-(--stone)">
                Kontak belum ada
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex w-[84vw] max-w-80 shrink-0 snap-center snap-always flex-col overflow-hidden rounded-[10px] border border-(--line) bg-white">
      <div className="relative aspect-16/8.5 shrink-0 bg-(--cream)">
        {imageContent}

        <span
          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-1 text-[9px] font-semibold ${
            isFull
              ? "bg-(--ink) text-white"
              : "bg-white/92 text-(--ink)"
          }`}
        >
          {isFull
            ? "Penuh"
            : `${available} tersedia`}
        </span>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col p-3">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-semibold leading-tight text-(--ink)">
              {room.nama}
            </h3>

            <p className="mt-0.5 flex min-w-0 items-center gap-1 truncate text-[10px] text-(--stone)">
              <MapPin
                size={11}
                className="shrink-0"
              />
              <span className="truncate">
                {branchName}
              </span>
            </p>
          </div>

          {room.ukuran && (
            <span className="flex shrink-0 items-center gap-1 text-[10px] text-(--stone)">
              <Maximize2 size={11} />
              {room.ukuran}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex min-w-0 items-baseline gap-1">
          <strong className="truncate font-(family-name:--font-fraunces) text-[18px] font-semibold leading-none tracking-[-0.02em] text-(--accent)">
            {rupiah(room.harga_bulanan)}
          </strong>

          <span className="shrink-0 text-[9px] text-(--stone)">
            /{room.periode_harga}
          </span>
        </div>

        <div className="mt-1.5 flex min-w-0 items-center gap-3 overflow-hidden text-[9px] text-(--stone)">
          {room.ukuran && (
            <span className="flex min-w-0 shrink items-center gap-1">
              <Maximize2
                size={10}
                className="shrink-0"
              />
              <span className="truncate">
                {room.ukuran}
              </span>
            </span>
          )}

          <span className="flex min-w-0 shrink items-center gap-1">
            <BedDouble
              size={10}
              className="shrink-0"
            />
            <span className="truncate">
              {room.tipe}
            </span>
          </span>
        </div>

        <div
          className={`mt-2 flex items-center text-[10px] font-semibold ${
            isFull
              ? "text-red-700"
              : "text-emerald-700"
          }`}
        >
          {isFull ? (
            <>
              <CircleX
                size={13}
                className="mr-1 shrink-0"
              />
              Kamar penuh
            </>
          ) : (
            <>
              <CheckCircle2
                size={13}
                className="mr-1 shrink-0"
              />
              {available} kamar tersedia
            </>
          )}
        </div>

        <div className="mt-auto pt-2">
          <div className="mb-2 flex items-center justify-between border-t border-(--line) pt-2 text-[9px] text-(--stone)">
            <span>
              {available} tersedia
            </span>

            <span>
              {total} total kamar
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={onDetail}
              className="flex h-9 w-full min-w-0 items-center justify-center rounded-lg border border-(--line-strong) bg-white px-2 text-[10px] font-semibold leading-none text-(--ink) transition hover:bg-(--cream)"
            >
              Detail
            </button>

            {bookingUrl ? (
              <a
                href={isFull ? undefined : bookingUrl}
                target={isFull ? undefined : "_blank"}
                rel={isFull ? undefined : "noreferrer"}
                aria-disabled={isFull}
                className={`flex h-9 w-full min-w-0 items-center justify-center gap-1 rounded-lg px-2 text-[10px] font-semibold leading-none ${
                  isFull
                    ? "pointer-events-none bg-(--neutral) text-(--stone)"
                    : "bg-(--accent) text-white! transition hover:bg-(--accent-dark)"
                }`}
              >
                <MessageCircle size={13} />
                {isFull ? "Penuh" : "Tanya"}
              </a>
            ) : (
              <div className="flex h-9 w-full min-w-0 items-center justify-center rounded-lg bg-(--neutral) px-2 text-[10px] font-semibold leading-none text-(--stone)">
                Tanya
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}