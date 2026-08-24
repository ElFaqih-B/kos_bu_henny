"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { rupiah } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import type { Kamar } from "@/lib/types";

type RoomDetailModalProps = {
  room: Kamar | null;
  whatsappNumber?: string | null;
  onClose: () => void;
};

type GalleryItem = {
  src: string;
  alt: string;
  caption?: string | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

export default function RoomDetailModal({
  room,
  whatsappNumber,
  onClose,
}: RoomDetailModalProps) {
  const [detailRoom, setDetailRoom] =
    useState<Kamar | null>(room);

  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const frame = window.requestAnimationFrame(() => {
      if (cancelled) {
        return;
      }

      setDetailRoom(room);
      setActiveImage(0);
      setClosing(false);
      setVisible(true);
      setLoading(Boolean(room?.slug && API_BASE_URL));
    });

    if (!room?.slug || !API_BASE_URL) {
      return () => {
        cancelled = true;
        window.cancelAnimationFrame(frame);
      };
    }

    const loadDetail = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/kamar/${encodeURIComponent(
            room.slug,
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = (await response.json()) as Kamar;

        if (cancelled) {
          return;
        }

        setDetailRoom(data);
        setActiveImage(0);
      } catch {
        if (!cancelled) {
          setDetailRoom(room);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [room]);

  useEffect(() => {
    if (!room) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [room]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const images = useMemo<GalleryItem[]>(() => {
    if (!detailRoom) {
      return [];
    }

    const result: GalleryItem[] = [];
    const used = new Set<string>();

    const cover = mediaUrl(
      detailRoom.url_gambar,
    );

    if (cover) {
      result.push({
        src: cover,
        alt: `Foto utama ${detailRoom.nama}`,
        caption: null,
      });

      used.add(cover);
    }

    const photos = detailRoom.foto ?? [];

    [...photos]
      .filter((photo) => photo.aktif)
      .sort(
        (a, b) =>
          a.urutan - b.urutan ||
          a.id - b.id,
      )
      .forEach((photo) => {
        const src = mediaUrl(
          photo.path_foto,
        );

        if (!src || used.has(src)) {
          return;
        }

        used.add(src);

        result.push({
          src,
          alt:
            photo.teks_alt ||
            `Foto ${detailRoom.nama}`,
          caption: photo.caption,
        });
      });

    return result;
  }, [detailRoom]);

  const safeImageIndex =
    images.length > 0
      ? Math.min(
          activeImage,
          images.length - 1,
        )
      : 0;

  const activeItem =
    images[safeImageIndex];

  const previousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1,
    );
  };

  const nextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1,
    );
  };

  const requestClose = () => {
    if (closing) {
      return;
    }

    setClosing(true);
    setVisible(false);

    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (!room) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        previousImage();
        return;
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [room, images.length]);

  const whatsappHref = useMemo(() => {
    if (!whatsappNumber || !detailRoom) {
      return null;
    }

    const phone =
      whatsappNumber.replace(/\D/g, "");

    if (!phone) {
      return null;
    }

    const message = [
      `Halo, saya tertarik dengan kamar ${detailRoom.nama}.`,
      `Harga: ${rupiah(
        detailRoom.harga_bulanan,
      )}/${detailRoom.periode_harga}.`,
      "",
      "Apakah kamar ini masih tersedia?",
    ].join("\n");

    return `https://wa.me/${phone}?text=${encodeURIComponent(
      message,
    )}`;
  }, [whatsappNumber, detailRoom]);

  if (!room || !detailRoom) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-0 z-100",
        "flex items-center justify-center",
        "bg-black/45",
        "px-3 py-4 sm:px-5 sm:py-6",
        "transition-opacity duration-300 ease-out",
        visible && !closing
          ? "opacity-100"
          : "opacity-0",
      ].join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${detailRoom.nama}`}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          requestClose();
        }
      }}
    >
      <div
        className={[
          "relative flex flex-col overflow-hidden",
          "w-[calc(100vw-24px)] max-w-107.5",
          "max-h-[82dvh]",
          "rounded-2xl bg-white",
          "shadow-[0_24px_80px_rgba(0,0,0,0.24)]",
          "sm:w-full sm:max-w-205",
          "sm:max-h-[82dvh]",
          "transform-gpu",
          "transition-[transform,opacity]",
          "duration-300",
          "ease-[cubic-bezier(0.22,1,0.36,1)]",
          visible && !closing
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.985] opacity-0",
        ].join(" ")}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <header
          className="
            relative z-10 flex shrink-0
            items-center justify-between gap-3
            border-b border-(--line)
            bg-white px-4 py-3
            sm:px-5 sm:py-3.5
          "
        >
          <div className="min-w-0">
            <p className="text-[11px] text-(--stone)">
              Detail kamar
            </p>

            <h2
              className="
                truncate text-base font-semibold
                text-(--ink)
                sm:text-lg
              "
            >
              {detailRoom.nama}
            </h2>
          </div>

          <button
            type="button"
            onClick={requestClose}
            aria-label="Tutup detail kamar"
            className="
              grid size-9 shrink-0
              place-items-center
              rounded-lg
              border border-(--line)
              bg-white text-(--ink)
              transition-all duration-200
              hover:bg-(--cream)
              active:scale-90
              sm:size-10
            "
          >
            <X size={18} />
          </button>
        </header>

        <div
          className="
            min-h-0 flex flex-1
            flex-col overflow-hidden
            sm:grid
            sm:grid-cols-[1.05fr_0.95fr]
          "
        >
          <div
            className="
              relative h-47.5 shrink-0
              bg-(--cream)
              sm:h-full
              sm:min-h-105
            "
          >
            {activeItem ? (
              <>
                <img
                  src={activeItem.src}
                  alt={activeItem.alt}
                  className="
                    h-full w-full
                    object-cover
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute inset-x-0 bottom-0
                    h-24
                    bg-linear-to-t
                    from-black/45
                    to-transparent
                  "
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={previousImage}
                      aria-label="Foto sebelumnya"
                      className="
                        absolute left-3 top-1/2
                        grid size-8
                        -translate-y-1/2
                        place-items-center
                        rounded-full
                        bg-black/45
                        text-white
                        backdrop-blur-sm
                        transition-all duration-200
                        hover:bg-black/60
                        active:scale-90
                        sm:left-4 sm:size-10
                      "
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Foto berikutnya"
                      className="
                        absolute right-3 top-1/2
                        grid size-8
                        -translate-y-1/2
                        place-items-center
                        rounded-full
                        bg-black/45
                        text-white
                        backdrop-blur-sm
                        transition-all duration-200
                        hover:bg-black/60
                        active:scale-90
                        sm:right-4 sm:size-10
                      "
                    >
                      <ChevronRight size={18} />
                    </button>

                    <div
                      className="
                        absolute bottom-3 right-3
                        rounded-full
                        bg-black/55
                        px-2.5 py-1
                        text-[10px]
                        font-medium text-white
                        backdrop-blur-sm
                        sm:bottom-4 sm:right-4
                      "
                    >
                      {safeImageIndex + 1} /{" "}
                      {images.length}
                    </div>
                  </>
                )}

                {activeItem.caption && (
                  <div
                    className="
                      absolute bottom-3 left-3
                      max-w-[65%]
                      rounded-md
                      bg-black/50
                      px-2.5 py-1
                      text-[10px]
                      text-white
                      backdrop-blur-sm
                    "
                  >
                    {activeItem.caption}
                  </div>
                )}
              </>
            ) : (
              <div
                className="
                  flex h-full
                  items-center justify-center
                  text-sm text-(--stone)
                "
              >
                Foto kamar belum tersedia
              </div>
            )}

            {loading && (
              <div
                className="
                  absolute left-3 top-3
                  flex items-center gap-1.5
                  rounded-full
                  bg-black/50
                  px-2.5 py-1.5
                  text-[10px] text-white
                  backdrop-blur-sm
                "
              >
                <Loader2
                  size={12}
                  className="animate-spin"
                />
                Memuat
              </div>
            )}
          </div>

          <div
            className="
              min-h-0
              overflow-y-auto
              overscroll-contain
              scrollbar-none
              [&::-webkit-scrollbar]:hidden
              bg-white
            "
          >
            <div
              className="
                px-4 py-4
                sm:px-6 sm:py-6
              "
            >
              <p className="text-xs text-(--stone)">
                {detailRoom.tipe}
              </p>

              <h3
                className="
                  mt-1
                  text-xl font-semibold
                  leading-tight
                  tracking-[-0.02em]
                  text-(--ink)
                  sm:text-2xl
                "
              >
                {detailRoom.nama}
              </h3>

              {detailRoom.cabang?.nama && (
                <div
                  className="
                    mt-2
                    flex items-center gap-1.5
                    text-xs text-(--stone)
                    sm:text-sm
                  "
                >
                  <MapPin size={14} />

                  <span>
                    {detailRoom.cabang.nama}
                  </span>
                </div>
              )}

              <div className="mt-4">
                <p
                  className="
                    text-[11px]
                    text-(--stone)
                  "
                >
                  Harga per bulan
                </p>

                <div
                  className="
                    mt-0.5
                    flex items-baseline gap-1.5
                  "
                >
                  <span
                    className="
                      text-xl font-bold
                      text-(--accent)
                    "
                  >
                    {rupiah(
                      detailRoom.harga_bulanan,
                    )}
                  </span>

                  <span
                    className="
                      text-xs text-(--stone)
                    "
                  >
                    / {detailRoom.periode_harga}
                  </span>
                </div>
              </div>

              <div
                className="
                  mt-4 grid
                  grid-cols-2 gap-2
                "
              >
                <div
                  className="
                    rounded-lg
                    border border-(--line)
                    bg-(--cream)
                    px-3 py-2.5
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-(--stone)
                    "
                  >
                    Ketersediaan
                  </p>

                  <p
                    className={`
                      mt-0.5
                      text-sm font-semibold
                      ${
                        detailRoom.kamar_tersedia > 0
                          ? "text-(--accent)"
                          : "text-(--stone)"
                      }
                    `}
                  >
                    {detailRoom.kamar_tersedia} kamar
                  </p>
                </div>

                <div
                  className="
                    rounded-lg
                    border border-(--line)
                    bg-(--cream)
                    px-3 py-2.5
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-(--stone)
                    "
                  >
                    Ukuran
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm font-semibold
                      text-(--ink)
                    "
                  >
                    {detailRoom.ukuran || "-"}
                  </p>
                </div>
              </div>

              {detailRoom.fasilitas &&
                detailRoom.fasilitas.length > 0 && (
                  <section className="mt-5">
                    <h4
                      className="
                        text-sm font-semibold
                        text-(--ink)
                      "
                    >
                      Fasilitas
                    </h4>

                    <div
                      className="
                        mt-2.5
                        grid grid-cols-2
                        gap-x-3 gap-y-2
                      "
                    >
                      {detailRoom.fasilitas.map(
                        (facility, index) => (
                          <div
                            key={`${facility}-${index}`}
                            className="
                              flex min-w-0
                              items-center gap-2
                            "
                          >
                            <span
                              className="
                                grid size-5 shrink-0
                                place-items-center
                                rounded-full
                                bg-(--cream)
                                text-(--accent)
                              "
                            >
                              <Check
                                size={12}
                                strokeWidth={2.5}
                              />
                            </span>

                            <span
                              className="
                                truncate
                                text-xs
                                text-(--ink-soft)
                              "
                            >
                              {facility}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                )}

              {detailRoom.deskripsi && (
                <section className="mt-5">
                  <h4
                    className="
                      text-sm font-semibold
                      text-(--ink)
                    "
                  >
                    Tentang kamar
                  </h4>

                  <p
                    className="
                      mt-2
                      text-xs leading-5
                      text-(--stone)
                      sm:text-sm sm:leading-6
                    "
                  >
                    {detailRoom.deskripsi}
                  </p>
                </section>
              )}

              <div className="h-2" />
            </div>
          </div>
        </div>

        {whatsappHref &&
          detailRoom.kamar_tersedia > 0 && (
            <div
              className="
                relative z-20
                shrink-0
                border-t border-(--line)
                bg-white
                px-4 py-3
                sm:px-5 sm:py-3.5
              "
            >
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex h-11 w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-(--accent)
                  px-5
                  text-sm font-semibold
                  text-white!
                  shadow-sm
                  transition-all duration-200
                  hover:bg-(--accent-dark)
                  hover:shadow-md
                  active:scale-[0.985]
                "
              >
                <MessageCircle size={17} />
                Tanya kamar via WhatsApp
              </a>
            </div>
          )}
      </div>
    </div>
  );
}