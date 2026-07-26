"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { imageUrl } from "@/lib/api";
import type { Dokumentasi, Konten } from "@/lib/types";

export default function GallerySection({
  items,
  content,
}: {
  items: Dokumentasi[];
  content?: Konten;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleItems = useMemo(
    () =>
      items
        .filter((item) => item.aktif !== false && Boolean(item.path_foto))
        .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0)),
    [items],
  );

  if (!visibleItems.length) return null;

  const goToSlide = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const nextIndex = (index + visibleItems.length) % visibleItems.length;
    slider.scrollTo({
      left: slider.clientWidth * nextIndex,
      behavior: "smooth",
    });
    setActiveIndex(nextIndex);
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider || slider.clientWidth === 0) return;

    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    if (index >= 0 && index < visibleItems.length) setActiveIndex(index);
  };

  return (
    <section id="galeri" className="bg-[var(--cream)] pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title mx-auto">
            {content?.judul || "Dokumentasi Kos Bu Henny"}
          </h2>
          {content?.isi && (
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[var(--stone)]">
              {content.isi}
            </p>
          )}
        </div>

        <div className="relative mx-auto mt-8 max-w-5xl sm:mt-10">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="gallery-rail flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto rounded-[10px] bg-[var(--parchment)] sm:aspect-[16/9] lg:aspect-[16/8]"
            aria-label="Galeri dokumentasi Kos Bu Henny"
          >
            {visibleItems.map((item) => {
              const src = imageUrl(item.path_foto);
              if (!src) return null;

              return (
                <figure key={item.id} className="relative min-w-full snap-center overflow-hidden">
                  <img
                    src={src}
                    alt={item.teks_alt || item.caption || "Dokumentasi Kos Bu Henny"}
                    className="h-full w-full object-cover"
                  />

                  {item.caption && (
                    <>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-[rgba(50,45,41,.78)] to-transparent" />
                      <figcaption className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-6">
                        <p className="max-w-xl font-editorial text-[20px] leading-tight text-white sm:text-[24px]">
                          {item.caption}
                        </p>
                      </figcaption>
                    </>
                  )}
                </figure>
              );
            })}
          </div>

          {visibleItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goToSlide(activeIndex - 1)}
                aria-label="Foto sebelumnya"
                className="absolute left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-lg border border-white/30 bg-[rgba(50,45,41,.34)] text-white backdrop-blur-md transition-colors hover:bg-[rgba(50,45,41,.58)] sm:left-4"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => goToSlide(activeIndex + 1)}
                aria-label="Foto berikutnya"
                className="absolute right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-lg border border-white/30 bg-[rgba(50,45,41,.34)] text-white backdrop-blur-md transition-colors hover:bg-[rgba(50,45,41,.58)] sm:right-4"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {visibleItems.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2" aria-label="Navigasi galeri">
            {visibleItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Lihat foto ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-7 bg-[var(--accent)]"
                    : "w-1.5 bg-[var(--ink)]/20 hover:bg-[var(--ink)]/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
