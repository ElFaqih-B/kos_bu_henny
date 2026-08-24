// components/landing/RoomCard.tsx

"use client";

import Image from "next/image";
import {
  Check,
  MapPin,
  Maximize2,
  MessageCircle,
} from "lucide-react";

import { rupiah } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import {
  buildRoomWhatsappUrl,
} from "@/lib/whatsapp";
import type { Kamar } from "@/lib/types";

type RoomCardProps = {
  room: Kamar;
  whatsappNumber?: string | null;
  desktop?: boolean;
  onDetail: () => void;
};

export default function RoomCard({
  room,
  whatsappNumber,
  desktop = false,
  onDetail,
}: RoomCardProps) {
  const image = mediaUrl(
    room.url_gambar,
  );

  const total = Math.max(
    room.jumlah_kamar,
    0,
  );

  const available = Math.max(
    Math.min(
      room.kamar_tersedia,
      total,
    ),
    0,
  );

  const isFull =
    total > 0 && available === 0;

  const facilities =
    room.fasilitas ?? [];

  const visibleFacilities =
    facilities.slice(0, 3);

  const remainingFacilities =
    Math.max(
      facilities.length -
        visibleFacilities.length,
      0,
    );

  const bookingUrl =
    buildRoomWhatsappUrl(
      room,
      whatsappNumber,
    );

  const handleImageClick = (
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    onDetail();
  };

  if (desktop) {
    return (
      <article
        className="
          group
          overflow-hidden
          rounded-[10px]
          border
          border-(--line)
          bg-white
          transition-[transform,box-shadow,border-color]
          duration-300
          ease-out
          hover:-translate-y-1
          hover:border-(--line-strong)
          hover:shadow-[0_16px_36px_rgba(50,45,41,0.10)]
        "
      >
        <button
          type="button"
          onClick={onDetail}
          className="
            relative
            block
            aspect-4/3
            w-full
            bg-(--parchment)
            text-left
          "
          aria-label={`Lihat detail ${room.nama}`}
        >
          {image ? (
            <Image
              src={image}
              alt={room.nama}
              fill
              unoptimized
              sizes="33vw"
              className="
                object-cover
                transition-transform
                duration-500
                ease-out
                group-hover:scale-[1.035]
              "
            />
          ) : (
            <div
              className="
                grid
                h-full
                place-items-center
                text-sm
                text-(--stone)
              "
            >
              Foto belum tersedia
            </div>
          )}

          <AvailabilityBadge
            available={available}
            isFull={isFull}
          />
        </button>

        <div className="p-5">
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div className="min-w-0">
              <button
                type="button"
                onClick={onDetail}
                className="
                  text-left
                  transition-colors
                  hover:text-(--accent)
                "
              >
                <h3
                  className="
                    text-xl
                    font-semibold
                    leading-tight
                  "
                >
                  {room.nama}
                </h3>
              </button>

              {room.cabang?.nama && (
                <p
                  className="
                    mt-1
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-(--stone)
                  "
                >
                  <MapPin size={13} />
                  {room.cabang.nama}
                </p>
              )}
            </div>

            {room.ukuran && (
              <span
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  text-xs
                  text-(--stone)
                "
              >
                <Maximize2 size={13} />
                {room.ukuran}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-end gap-1">
            <p
              className="
                font-(family-name:--font-fraunces)
                text-2xl
                font-semibold
                tracking-tight
                text-(--accent)
              "
            >
              {rupiah(
                room.harga_bulanan,
              )}
            </p>

            <span
              className="
                pb-0.5
                text-xs
                text-(--stone)
              "
            >
              /{room.periode_harga}
            </span>
          </div>

          {room.deskripsi && (
            <p
              className="
                mt-3
                line-clamp-2
                text-sm
                leading-6
                text-(--stone)
              "
            >
              {room.deskripsi}
            </p>
          )}

          {facilities.length > 0 && (
            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-x-4
                gap-y-2
              "
            >
              {visibleFacilities.map(
                (facility) => (
                  <span
                    key={facility}
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      text-(--ink-soft)
                    "
                  >
                    <Check
                      size={13}
                      strokeWidth={2.2}
                      className="
                        text-(--accent)
                      "
                    />
                    {facility}
                  </span>
                ),
              )}

              {remainingFacilities >
                0 && (
                <span
                  className="
                    text-xs
                    font-medium
                    text-(--stone)
                  "
                >
                  +{remainingFacilities}{" "}
                  lainnya
                </span>
              )}
            </div>
          )}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-(--line)
              pt-4
            "
          >
            <p
              className="
                text-xs
                text-(--stone)
              "
            >
              <strong
                className="
                  font-semibold
                  text-(--ink)
                "
              >
                {available}
              </strong>{" "}
              tersedia dari {total} kamar
            </p>
          </div>

          <div
            className="
              mt-4
              grid
              grid-cols-2
              gap-2
            "
          >
            <button
              type="button"
              onClick={onDetail}
              className="
                flex
                min-h-11
                items-center
                justify-center
                rounded-lg
                border
                border-(--line-strong)
                bg-white
                px-3
                text-sm
                font-semibold
                text-(--ink)
                transition
                hover:border-(--ink)
                hover:bg-(--cream)
                active:scale-[0.99]
              "
            >
              Lihat detail
            </button>

            <BookingButton
              bookingUrl={bookingUrl}
              isFull={isFull}
              desktop
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="
        grid
        aspect-square
        grid-rows-[40%_60%]
        overflow-hidden
        rounded-[10px]
        border
        border-(--line)
        bg-white
      "
    >
      <button
        type="button"
        onClick={handleImageClick}
        className="
          relative
          min-h-0
          bg-(--parchment)
          text-left
        "
        aria-label={`Lihat detail ${room.nama}`}
      >
        {image ? (
          <Image
            src={image}
            alt={room.nama}
            fill
            loading="lazy"
            unoptimized
            sizes="84vw"
            className="object-cover"
          />
        ) : (
          <div
            className="
              grid
              h-full
              place-items-center
              text-xs
              text-(--stone)
            "
          >
            Foto belum tersedia
          </div>
        )}

        <AvailabilityBadge
          available={available}
          isFull={isFull}
        />
      </button>

      <div
        className="
          flex
          min-h-0
          flex-col
          p-3
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-2
          "
        >
          <div className="min-w-0">
            <button
              type="button"
              onClick={onDetail}
              className="
                block
                max-w-full
                text-left
              "
            >
              <h3
                className="
                  truncate
                  text-[16px]
                  font-semibold
                  leading-tight
                  text-(--ink)
                "
              >
                {room.nama}
              </h3>
            </button>

            {room.cabang?.nama && (
              <p
                className="
                  mt-0.5
                  flex
                  items-center
                  gap-1
                  truncate
                  text-[10px]
                  text-(--stone)
                "
              >
                <MapPin
                  size={11}
                  className="shrink-0"
                />
                {room.cabang.nama}
              </p>
            )}
          </div>

          {room.ukuran && (
            <span
              className="
                flex
                shrink-0
                items-center
                gap-1
                text-[10px]
                text-(--stone)
              "
            >
              <Maximize2 size={11} />
              {room.ukuran}
            </span>
          )}
        </div>

        <div
          className="
            mt-1.5
            flex
            items-baseline
            gap-1
          "
        >
          <p
            className="
              font-(family-name:--font-fraunces)
              text-[18px]
              font-semibold
              leading-none
              tracking-[-0.02em]
              text-(--accent)
            "
          >
            {rupiah(
              room.harga_bulanan,
            )}
          </p>

          <span
            className="
              text-[9px]
              text-(--stone)
            "
          >
            /{room.periode_harga}
          </span>
        </div>

        {room.deskripsi && (
          <p
            className="
              mt-1
              line-clamp-1
              text-[10px]
              leading-4
              text-(--stone)
            "
          >
            {room.deskripsi}
          </p>
        )}

        {facilities.length > 0 && (
          <div
            className="
              mt-1.5
              flex
              min-w-0
              items-center
              gap-2
              overflow-hidden
            "
          >
            {visibleFacilities.map(
              (facility) => (
                <span
                  key={facility}
                  className="
                    flex
                    min-w-0
                    shrink
                    items-center
                    gap-1
                    text-[9px]
                    text-(--ink-soft)
                  "
                >
                  <Check
                    size={10}
                    strokeWidth={2.4}
                    className="
                      shrink-0
                      text-(--accent)
                    "
                  />

                  <span className="truncate">
                    {facility}
                  </span>
                </span>
              ),
            )}

            {remainingFacilities >
              0 && (
              <span
                className="
                  shrink-0
                  text-[9px]
                  font-semibold
                  text-(--stone)
                "
              >
                +{remainingFacilities}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto">
          <div
            className="
              mb-2
              flex
              items-center
              justify-between
              border-t
              border-(--line)
              pt-2
            "
          >
            <p
              className="
                text-[10px]
                text-(--stone)
              "
            >
              <strong
                className="
                  font-semibold
                  text-(--ink)
                "
              >
                {available}
              </strong>{" "}
              tersedia
            </p>

            <p
              className="
                text-[10px]
                text-(--stone)
              "
            >
              {total} total kamar
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-1.5
            "
          >
            <button
              type="button"
              onClick={onDetail}
              className="
                flex
                min-h-9
                items-center
                justify-center
                rounded-lg
                border
                border-(--line-strong)
                bg-white
                px-2
                text-[10px]
                font-semibold
                text-(--ink)
                transition
                active:bg-(--cream)
              "
            >
              Lihat detail
            </button>

            <BookingButton
              bookingUrl={bookingUrl}
              isFull={isFull}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function BookingButton({
  bookingUrl,
  isFull,
  desktop = false,
}: {
  bookingUrl: string | null;
  isFull: boolean;
  desktop?: boolean;
}) {
  const iconSize = desktop
    ? 16
    : 13;

  if (!bookingUrl) {
    return (
      <div
        className="
          flex
          min-h-9
          items-center
          justify-center
          gap-1
          rounded-lg
          bg-(--neutral)
          px-2
          text-[10px]
          font-semibold
          text-(--stone)
        "
      >
        <MessageCircle
          size={iconSize}
        />
        WhatsApp
      </div>
    );
  }

  return (
    <a
      href={
        isFull
          ? undefined
          : bookingUrl
      }
      target={
        isFull
          ? undefined
          : "_blank"
      }
      rel={
        isFull
          ? undefined
          : "noreferrer"
      }
      aria-disabled={isFull}
      className={`
        flex
        ${
          desktop
            ? "min-h-11 px-3 text-sm"
            : "min-h-9 px-2 text-[10px]"
        }
        items-center
        justify-center
        gap-1
        rounded-lg
        font-semibold
        transition
        ${
          isFull
            ? "pointer-events-none bg-(--neutral) text-(--stone)"
            : "bg-(--accent) text-white! hover:bg-(--accent-dark)"
        }
      `}
    >
      <MessageCircle
        size={iconSize}
      />

      {isFull
        ? "Penuh"
        : desktop
          ? "Tanya kamar"
          : "Tanya"}
    </a>
  );
}

function AvailabilityBadge({
  available,
  isFull,
}: {
  available: number;
  isFull: boolean;
}) {
  return (
    <div
      className="
        absolute
        left-3
        top-3
        rounded-full
        bg-black/55
        px-2.5
        py-1
        text-[10px]
        font-medium
        text-white
        backdrop-blur-sm
      "
    >
      {isFull
        ? "Penuh"
        : `${available} tersedia`}
    </div>
  );
}