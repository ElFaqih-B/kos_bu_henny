"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { mediaUrl } from "@/lib/media";
import type { Dokumentasi } from "@/lib/types";

type GalleryProps = {
  items: Dokumentasi[];
};

export default function GallerySection({ items }: GalleryProps) {
  const gallery = [...items]
    .filter((item) => item.aktif)
    .sort((a, b) => a.urutan - b.urutan);

  const [active, setActive] = useState(0);

  if (!gallery.length) return null;

  const current = gallery[active];
  const currentSrc = mediaUrl(current.path_foto);
  const desktopItems = gallery.slice(0, 5);

  // Navigasi Mobile
  const previous = () => {
    setActive((index) =>
      index === 0 ? gallery.length - 1 : index - 1,
    );
  };

  const next = () => {
    setActive((index) =>
      index === gallery.length - 1 ? 0 : index + 1,
    );
  };

  return (
    <section
      id="dokumentasi"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container-page">

        {/* Heading */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-[clamp(2rem,7vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-(--ink)">
            Lihat lebih dekat
          </h2>

          <p className="mt-3 text-sm leading-6 text-(--stone) sm:text-base">
            Dokumentasi kamar dan suasana Kos Omah Subardiman.
          </p>
        </div>

        {/* Gallery Mobile */}
        <div className="mt-8 lg:hidden">
          <div className="relative aspect-4/3 overflow-hidden rounded-[10px] bg-(--parchment)">
            {currentSrc && (
              <Image
                src={currentSrc}
                alt={
                  current.teks_alt ||
                  current.caption ||
                  "Dokumentasi Kos Omah Subardiman"
                }
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            )}

            {/* Counter */}
            {gallery.length > 1 && (
              <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2 py-1 text-[11px] font-medium text-white">
                {active + 1} / {gallery.length}
              </span>
            )}

            {/* Panah */}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Foto sebelumnya"
                  className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg bg-black/40 text-white transition active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Foto berikutnya"
                  className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg bg-black/40 text-white transition active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Caption */}
            {current.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent px-4 pb-4 pt-12">
                <p className="text-sm font-medium text-white">
                  {current.caption}
                </p>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
              {gallery.map((item, index) => {
                const src = mediaUrl(item.path_foto);

                if (!src) return null;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={
                      item.caption ||
                      `Lihat foto ${index + 1}`
                    }
                    className={`relative h-17 w-22 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      active === index
                        ? "border-(--accent) opacity-100"
                        : "border-transparent opacity-55"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      priority
                      unoptimized
                      sizes="88px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Gallery Desktop */}
        <div className="mt-10 hidden h-130 grid-cols-[1.35fr_1fr] gap-3 lg:grid">
          <GalleryImage item={desktopItems[0]} />

          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            {desktopItems.slice(1).map((item) => (
              <GalleryImage
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// Gambar Desktop
function GalleryImage({
  item,
}: {
  item?: Dokumentasi;
}) {
  if (!item) {
    return (
      <div className="rounded-[10px] bg-(--parchment)" />
    );
  }

  const src = mediaUrl(item.path_foto);

  if (!src) {
    return (
      <div className="rounded-[10px] bg-(--parchment)" />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[10px] bg-(--parchment)">
      <Image
        src={src}
        alt={
          item.teks_alt ||
          item.caption ||
          "Dokumentasi Kos Omah Subardiman"
        }
        fill
        unoptimized
        sizes="50vw"
        className="object-cover transition-transform duration-500 hover:scale-[1.02]"
      />
    </div>
  );
}
