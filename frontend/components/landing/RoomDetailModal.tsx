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
import { useEffect, useMemo, useRef, useState } from "react";

import { rupiah } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import type { Kamar } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

const CLOSE_ANIMATION_MS = 300;

/** Joins truthy class fragments into a single className string. */
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function buildGallery(room: Kamar | null): GalleryItem[] {
  if (!room) return [];

  const items: GalleryItem[] = [];
  const seen = new Set<string>();

  const cover = mediaUrl(room.url_gambar);
  if (cover) {
    items.push({ src: cover, alt: `Foto utama ${room.nama}`, caption: null });
    seen.add(cover);
  }

  const sortedPhotos = [...(room.foto ?? [])]
    .filter((photo) => photo.aktif)
    .sort((a, b) => a.urutan - b.urutan || a.id - b.id);

  for (const photo of sortedPhotos) {
    const src = mediaUrl(photo.path_foto);
    if (!src || seen.has(src)) continue;

    seen.add(src);
    items.push({
      src,
      alt: photo.teks_alt || `Foto ${room.nama}`,
      caption: photo.caption,
    });
  }

  return items;
}

function buildWhatsAppHref(
  whatsappNumber: string | null | undefined,
  room: Kamar | null,
): string | null {
  if (!whatsappNumber || !room) return null;

  const phone = whatsappNumber.replace(/\D/g, "");
  if (!phone) return null;

  const message = [
    `Halo, saya tertarik dengan kamar ${room.nama}.`,
    `Harga: ${rupiah(room.harga_bulanan)}/${room.periode_harga}.`,
    "",
    "Apakah kamar ini masih tersedia?",
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ---------------------------------------------------------------------------
// Data hooks
// ---------------------------------------------------------------------------

function useRoomDetail(room: Kamar | null) {
  const [detailRoom, setDetailRoom] = useState<Kamar | null>(room);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setDetailRoom(room);
    setLoading(Boolean(room?.slug && API_BASE_URL));

    if (!room?.slug || !API_BASE_URL) return;

    (async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/kamar/${encodeURIComponent(room.slug)}`,
          { method: "GET", headers: { Accept: "application/json" }, cache: "no-store" },
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = (await response.json()) as Kamar;
        if (!cancelled) setDetailRoom(data);
      } catch {
        if (!cancelled) setDetailRoom(room);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [room]);

  return { detailRoom, loading };
}

/** Manages open/close animation state and returns a debounced close request. */
function useModalVisibility(isOpen: boolean, onClose: () => void) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setClosing(false);
    const frame = requestAnimationFrame(() => setVisible(true));

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const requestClose = () => {
    if (closing) return;

    setClosing(true);
    setVisible(false);
    closeTimerRef.current = setTimeout(onClose, CLOSE_ANIMATION_MS);
  };

  return { visible, closing, requestClose };
}

/** Locks page scroll while the modal is mounted. */
function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}

/** Image carousel state + keyboard navigation. */
function useGalleryNavigation(
  images: GalleryItem[],
  active: boolean,
  onEscape: () => void,
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const safeIndex =
    images.length > 0 ? Math.min(activeIndex, images.length - 1) : 0;

  const goToPrevious = () => {
    if (images.length <= 1) return;
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const goToNext = () => {
    if (images.length <= 1) return;
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
      else if (event.key === "ArrowLeft") goToPrevious();
      else if (event.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, images.length, onEscape]);

  return {
    activeItem: images[safeIndex],
    activeIndex: safeIndex,
    total: images.length,
    goToPrevious,
    goToNext,
  };
}

// ---------------------------------------------------------------------------
// Presentational subcomponents
// ---------------------------------------------------------------------------

function GalleryImage({
  item,
  index,
  total,
  loading,
  onPrevious,
  onNext,
}: {
  item?: GalleryItem;
  index: number;
  total: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-(--stone)">
        Foto kamar belum tersedia
      </div>
    );
  }

  return (
    <>
      <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/45 to-transparent" />

      {total > 1 && (
        <>
          <NavArrow direction="left" onClick={onPrevious} />
          <NavArrow direction="right" onClick={onNext} />

          <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:bottom-4 sm:right-4">
            {index + 1} / {total}
          </div>
        </>
      )}

      {item.caption && (
        <div className="absolute bottom-3 left-3 max-w-[65%] rounded-md bg-black/50 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm">
          {item.caption}
        </div>
      )}

      {loading && (
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-sm">
          <Loader2 size={12} className="animate-spin" />
          Memuat
        </div>
      )}
    </>
  );
}

function NavArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "Foto sebelumnya" : "Foto berikutnya"}
      className={cx(
        "absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full",
        "bg-black/45 text-white backdrop-blur-sm transition-all duration-200",
        "hover:bg-black/60 active:scale-90 sm:size-10",
        isLeft ? "left-3 sm:left-4" : "right-3 sm:right-4",
      )}
    >
      <Icon size={18} />
    </button>
  );
}

function StatCard({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-lg border border-(--line) bg-(--cream) px-3 py-2.5">
      <p className="text-[10px] text-(--stone)">{label}</p>
      <p
        className={cx(
          "mt-0.5 text-sm font-semibold",
          emphasize ? "text-(--accent)" : "text-(--ink)",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function FacilityList({ facilities }: { facilities: string[] }) {
  if (facilities.length === 0) return null;

  return (
    <section className="mt-5">
      <h4 className="text-sm font-semibold text-(--ink)">Fasilitas</h4>

      <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
        {facilities.map((facility, index) => (
          <div key={`${facility}-${index}`} className="flex min-w-0 items-center gap-2">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-(--cream) text-(--accent)">
              <Check size={12} strokeWidth={2.5} />
            </span>
            <span className="truncate text-xs text-(--ink-soft)">{facility}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoomInfoPanel({
  room,
}: {
  room: Kamar;
}) {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6">
      <p className="text-xs text-(--stone)">{room.tipe}</p>

      <h3 className="mt-1 text-xl font-semibold leading-tight tracking-[-0.02em] text-(--ink) sm:text-2xl">
        {room.nama}
      </h3>

      {room.cabang?.nama && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-(--stone) sm:text-sm">
          <MapPin size={14} />
          <span>{room.cabang.nama}</span>
        </div>
      )}

      <div className="mt-4">
        <p className="text-[11px] text-(--stone)">Harga per bulan</p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-(--accent)">
            {rupiah(room.harga_bulanan)}
          </span>
          <span className="text-xs text-(--stone)">/ {room.periode_harga}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <StatCard
          label="Ketersediaan"
          value={`${room.kamar_tersedia} kamar`}
          emphasize={room.kamar_tersedia > 0}
        />
        <StatCard label="Ukuran" value={room.ukuran || "-"} />
      </div>

      {room.fasilitas && <FacilityList facilities={room.fasilitas} />}

      {room.deskripsi && (
        <section className="mt-5">
          <h4 className="text-sm font-semibold text-(--ink)">Tentang kamar</h4>
          <p className="mt-2 text-xs leading-5 text-(--stone) sm:text-sm sm:leading-6">
            {room.deskripsi}
          </p>
        </section>
      )}

      <div className="h-2" />
    </div>
  );
}

function WhatsAppCta({ href }: { href: string }) {
  return (
    <div className="relative z-20 shrink-0 border-t border-(--line) bg-white px-4 py-3 sm:px-5 sm:py-3.5">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-(--accent) px-5 text-sm font-semibold text-white! shadow-sm transition-all duration-200 hover:bg-(--accent-dark) hover:shadow-md active:scale-[0.985]"
      >
        <MessageCircle size={17} />
        Tanya kamar via WhatsApp
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RoomDetailModal({
  room,
  whatsappNumber,
  onClose,
}: RoomDetailModalProps) {
  const { detailRoom, loading } = useRoomDetail(room);
  const { visible, closing, requestClose } = useModalVisibility(
    Boolean(room),
    onClose,
  );

  useLockBodyScroll(Boolean(room));

  const images = useMemo(() => buildGallery(detailRoom), [detailRoom]);
  const gallery = useGalleryNavigation(images, Boolean(room), requestClose);

  const whatsappHref = useMemo(
    () => buildWhatsAppHref(whatsappNumber, detailRoom),
    [whatsappNumber, detailRoom],
  );

  if (!room || !detailRoom) return null;

  const showCta = Boolean(whatsappHref) && detailRoom.kamar_tersedia > 0;
  const isVisible = visible && !closing;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${detailRoom.nama}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className={cx(
        "fixed inset-0 z-100 flex items-center justify-center bg-black/45",
        "px-3 py-4 sm:px-5 sm:py-6 transition-opacity duration-300 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        onMouseDown={(event) => event.stopPropagation()}
        className={cx(
          "relative flex flex-col overflow-hidden rounded-2xl bg-white",
          "w-[calc(100vw-24px)] max-w-107.5 max-h-[82dvh]",
          "shadow-[0_24px_80px_rgba(0,0,0,0.24)]",
          "sm:w-full sm:max-w-205 sm:max-h-[82dvh]",
          "transform-gpu transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.985] opacity-0",
        )}
      >
        <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-(--line) bg-white px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="min-w-0">
            <p className="text-[11px] text-(--stone)">Detail kamar</p>
            <h2 className="truncate text-base font-semibold text-(--ink) sm:text-lg">
              {detailRoom.nama}
            </h2>
          </div>

          <button
            type="button"
            onClick={requestClose}
            aria-label="Tutup detail kamar"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-(--line) bg-white text-(--ink) transition-all duration-200 hover:bg-(--cream) active:scale-90 sm:size-10"
          >
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex flex-1 flex-col overflow-hidden sm:grid sm:grid-cols-[1.05fr_0.95fr]">
          <div className="relative h-47.5 shrink-0 bg-(--cream) sm:h-full sm:min-h-105">
            <GalleryImage
              item={gallery.activeItem}
              index={gallery.activeIndex}
              total={gallery.total}
              loading={loading}
              onPrevious={gallery.goToPrevious}
              onNext={gallery.goToNext}
            />
          </div>

          <div className="min-h-0 overflow-y-auto overscroll-contain scrollbar-none bg-white [&::-webkit-scrollbar]:hidden">
            <RoomInfoPanel room={detailRoom} />
          </div>
        </div>

        {showCta && whatsappHref && <WhatsAppCta href={whatsappHref} />}
      </div>
    </div>
  );
}