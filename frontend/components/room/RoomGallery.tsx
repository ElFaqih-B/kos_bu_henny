"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { mediaUrl } from "@/lib/media";
import type { KamarFoto } from "@/lib/types";

type RoomGalleryProps = {
  roomName: string;
  coverUrl?: string | null;
  photos?: KamarFoto[];
};

type GalleryItem = {
  key: string;
  src: string;
  alt: string;
  caption?: string | null;
};

export default function RoomGallery({
  roomName,
  coverUrl,
  photos = [],
}: RoomGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo<GalleryItem[]>(() => {
    const result: GalleryItem[] = [];
    const used = new Set<string>();

    const cover = mediaUrl(coverUrl);

    // Cover / foto utama kamar
    if (cover) {
      result.push({
        key: "cover",
        src: cover,
        alt: `Foto utama ${roomName}`,
        caption: null,
      });

      used.add(cover);
    }

    // Dokumentasi kamar
    [...photos]
      .filter((photo) => photo.aktif)
      .sort(
        (a, b) =>
          a.urutan - b.urutan ||
          a.id - b.id,
      )
      .forEach((photo) => {
        const src = mediaUrl(photo.path_foto);

        if (!src || used.has(src)) {
          return;
        }

        used.add(src);

        result.push({
          key: `foto-${photo.id}`,
          src,
          alt:
            photo.teks_alt ||
            `Foto ${roomName}`,
          caption: photo.caption,
        });
      });

    return result;
  }, [coverUrl, photos, roomName]);


  if (items.length === 0) {
    return (
      <div className="grid aspect-4/3 place-items-center rounded-[10px] bg-(--cream) text-(--stone)">
        <div className="flex flex-col items-center gap-3">
          <Images size={28} />

          <p className="text-sm">
            Foto kamar belum tersedia.
          </p>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(
    activeIndex,
    items.length - 1,
  );

  const activeItem = items[safeIndex];

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0
        ? items.length - 1
        : current - 1,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === items.length - 1
        ? 0
        : current + 1,
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-4/3 overflow-hidden rounded-[10px] bg-(--cream)">
        <Image
          src={activeItem.src}
          alt={activeItem.alt}
          fill
          priority={safeIndex === 0}
          unoptimized
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
        />

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg border border-white/30 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg border border-white/30 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55"
            >
              <ChevronRight size={19} />
            </button>

            <div className="absolute bottom-3 right-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {safeIndex + 1} / {items.length}
            </div>
          </>
        )}
      </div>

      {/* Caption */}
      {activeItem.caption && (
        <p className="mt-3 text-sm text-(--stone)">
          {activeItem.caption}
        </p>
      )}

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Tampilkan foto ${
                index + 1
              }`}
              aria-current={
                index === safeIndex
                  ? "true"
                  : undefined
              }
              className={`relative aspect-4/3 w-24 shrink-0 snap-start overflow-hidden rounded-lg border-2 transition ${
                index === safeIndex
                  ? "border-(--accent)"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                unoptimized
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}