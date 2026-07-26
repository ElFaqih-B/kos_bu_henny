import {
  Ban,
  Check,
  MapPin,
  MessageCircle,
  Ruler,
} from "lucide-react";

import {
  imageUrl,
  rupiah,
  whatsappUrl,
} from "@/lib/api";

import type {
  Kamar,
  Pengaturan,
} from "@/lib/types";

export default function RoomCard({
  room,
  settings,
  compact = false,
}: {
  room: Kamar;
  settings: Pengaturan;
  compact?: boolean;
}) {
  const image = imageUrl(room.url_gambar);

  const wa = whatsappUrl(
    settings.nomor_whatsapp,
    room,
    room.cabang,
  );

  /*
   * Occupancy
   *
   * jumlah_kamar     = kapasitas total
   * kamar_tersedia   = jumlah yang masih kosong
   * occupied         = jumlah yang sudah terisi
   */
  const total = Math.max(room.jumlah_kamar, 0);

  const available = Math.max(
    Math.min(room.kamar_tersedia, total),
    0,
  );

  const occupied = Math.max(
    total - available,
    0,
  );

  const isFull =
    total > 0 && available === 0;

  return (
    <article
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden

        rounded-[10px]
        border
        border-[var(--line)]

        bg-white

        transition
        duration-200

        hover:border-[var(--line-strong)]

        md:hover:-translate-y-1
        md:hover:shadow-[var(--shadow-card)]
      "
    >
      {/* =========================
          IMAGE
      ========================== */}
      <div
        className={`
          relative
          overflow-hidden
          bg-[var(--parchment)]

          ${
            compact
              ? "aspect-[16/10]"
              : "aspect-[4/3]"
          }
        `}
      >
        {image ? (
          <img
            src={image}
            alt={`Foto ${room.nama}`}
            className="
              h-full
              w-full
              object-cover

              transition-transform
              duration-500

              md:group-hover:scale-[1.025]
            "
          />
        ) : (
          <div
            className="
              grid
              h-full
              w-full
              place-items-center

              p-6
              text-center
              text-sm
              text-[var(--stone)]
            "
          >
            Foto kamar belum ditambahkan.
          </div>
        )}

        {/* Status */}
        <span
          className={`
            absolute
            left-3
            top-3

            rounded-[7px]
            px-2.5
            py-1.5

            text-[10px]
            font-semibold

            ${
              isFull
                ? `
                  bg-[var(--ink)]
                  text-white
                `
                : `
                  bg-[var(--cream)]
                  text-[var(--accent)]
                `
            }
          `}
        >
          {isFull
            ? "Kamar penuh"
            : `${available} tersedia`}
        </span>
      </div>

      {/* =========================
          CONTENT
      ========================== */}
      <div
        className={`
          flex
          flex-1
          flex-col

          ${
            compact
              ? "p-4"
              : "p-5 md:p-6"
          }
        `}
      >
        {/* Type */}
        <p
          className="
            text-[11px]
            font-semibold
            text-[var(--accent)]
          "
        >
          {room.tipe}
        </p>

        {/* Room name */}
        <h3
          className={`
            mt-1
            truncate
            leading-tight

            ${
              compact
                ? "text-[20px]"
                : "text-[22px]"
            }
          `}
        >
          {room.nama}
        </h3>

        {/* Branch */}
        {room.cabang && (
          <p
            className="
              mt-2
              flex
              min-w-0
              items-center
              gap-1.5

              text-xs
              text-[var(--stone)]
            "
          >
            <MapPin
              size={13}
              className="shrink-0"
              aria-hidden="true"
            />

            <span className="truncate">
              {room.cabang.nama}
            </span>
          </p>
        )}

        {/* Price */}
        <div
          className="
            mt-4
            flex
            flex-wrap
            items-baseline

            gap-x-2
            gap-y-1

            border-t
            border-[var(--line)]
            pt-4
          "
        >
          <strong
            className={`
              font-semibold
              tracking-[-.02em]
              text-[var(--ink)]

              ${
                compact
                  ? "text-[17px]"
                  : "text-[18px]"
              }
            `}
          >
            {rupiah(room.harga_bulanan)}
          </strong>

          <span
            className="
              text-xs
              text-[var(--stone)]
            "
          >
            /{room.periode_harga}
          </span>
        </div>

        {/* Size */}
        {room.ukuran && (
          <p
            className="
              mt-2
              flex
              items-center
              gap-1.5

              text-xs
              text-[var(--text-secondary)]
            "
          >
            <Ruler
              size={13}
              aria-hidden="true"
            />

            {room.ukuran}
          </p>
        )}

        {/* Description */}
        {room.deskripsi && (
          <p
            className="
              mt-3
              line-clamp-2

              text-[13px]
              leading-5
              text-[var(--stone)]

              md:text-sm
              md:leading-6
            "
          >
            {room.deskripsi}
          </p>
        )}

        {/* Facilities */}
        {!!room.fasilitas.length && (
          <div
            className="
              mt-4
              grid
              grid-cols-2

              gap-x-3
              gap-y-2
            "
          >
            {room.fasilitas
              .slice(0, 4)
              .map((item) => (
                <span
                  key={item}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-1.5

                    text-xs
                    text-[var(--text-secondary)]
                  "
                >
                  <Check
                    size={12}
                    className="
                      shrink-0
                      text-[var(--accent)]
                    "
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {item}
                  </span>
                </span>
              ))}
          </div>
        )}

        {/* =========================
            OCCUPANCY + CTA
        ========================== */}
        <div
          className="
            mt-auto
            pt-5
          "
        >
          <div
            className="
              flex
              items-end
              justify-between
              gap-4

              border-t
              border-[var(--line)]
              pt-4
            "
          >
            {/* Occupancy */}
            <div className="min-w-0">
              <p
                className="
                  font-(family-name:--font-fraunces)

                  text-[21px]
                  font-medium
                  leading-none
                  tracking-[-0.02em]

                  text-[var(--ink)]
                "
              >
                {total > 0
                  ? `${occupied}/${total}`
                  : "—"}
              </p>

              <p
                className="
                  mt-1.5
                  text-[11px]
                  text-[var(--stone)]
                "
              >
                penghuni
              </p>
            </div>

            {/* Full */}
            {isFull ? (
              <button
                type="button"
                disabled
                className="
                  inline-flex
                  min-h-11
                  cursor-not-allowed

                  items-center
                  justify-center
                  gap-2

                  rounded-[8px]
                  border
                  border-[var(--line)]

                  bg-[var(--neutral)]

                  px-4

                  text-sm
                  font-semibold
                  text-[var(--stone)]

                  opacity-80
                "
              >
                <Ban
                  size={15}
                  aria-hidden="true"
                />

                Kamar penuh
              </button>
            ) : wa ? (
              /* Available */
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                aria-label={`Tanya ketersediaan ${room.nama}`}
                className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2

                rounded-[8px]

                bg-[#72383D]
                px-4

                text-sm
                font-semibold
                !text-white

                transition-colors

                hover:bg-[#5D2D31]


                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-(--accent)
                  focus-visible:ring-offset-2
                "
              >
                <MessageCircle
                  size={15}
                  aria-hidden="true"
                />

                Tanya kamar
              </a>
            ) : (
              /* No WhatsApp number */
              <button
                type="button"
                disabled
                className="
                  inline-flex
                  min-h-11
                  cursor-not-allowed

                  items-center
                  justify-center

                  rounded-[8px]
                  border
                  border-[var(--line)]

                  bg-[var(--cream)]

                  px-4

                  text-xs
                  font-medium
                  text-[var(--stone)]
                "
              >
                WhatsApp belum tersedia
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}