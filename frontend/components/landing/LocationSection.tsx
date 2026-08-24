"use client";

import {
  Check,
  ChevronDown,
  ExternalLink,
  MapPin,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Cabang } from "@/lib/types";

type LocationSectionProps = {
  branches: Cabang[];
};

function isValidCoordinate(
  value: number | null | undefined,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function buildMapEmbedUrl(
  branch: Cabang,
): string {
  const latitude = branch.latitude;
  const longitude = branch.longitude;

  /*
   * Koordinat hasil resolusi backend adalah
   * sumber utama posisi peta.
   */
  if (
    isValidCoordinate(latitude) &&
    isValidCoordinate(longitude)
  ) {
    return (
      "https://www.google.com/maps" +
      `?q=${latitude},${longitude}` +
      "&z=17" +
      "&output=embed"
    );
  }

  /*
   * Fallback hanya jika data lama belum mempunyai
   * latitude/longitude.
   *
   * Ini berguna untuk cabang lama yang belum pernah
   * disimpan ulang setelah fitur koordinat ditambahkan.
   */
  const addressQuery = [
    branch.alamat,
    branch.kota,
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");

  return (
    "https://www.google.com/maps" +
    `?q=${encodeURIComponent(addressQuery)}` +
    "&output=embed"
  );
}

function buildGoogleMapsLink(
  branch: Cabang,
): string {
  const mapsUrl = branch.url_maps?.trim();

  if (mapsUrl) {
    return mapsUrl;
  }

  if (
    isValidCoordinate(branch.latitude) &&
    isValidCoordinate(branch.longitude)
  ) {
    return (
      "https://www.google.com/maps" +
      `?q=${branch.latitude},${branch.longitude}`
    );
  }

  const addressQuery = [
    branch.alamat,
    branch.kota,
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");

  return (
    "https://www.google.com/maps" +
    `?q=${encodeURIComponent(addressQuery)}`
  );
}

export default function LocationSection({
  branches,
}: LocationSectionProps) {
  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const activeBranches = useMemo(
    () =>
      [...branches]
        .filter((branch) => branch.aktif)
        .sort(
          (a, b) =>
            a.urutan - b.urutan ||
            a.id - b.id,
        ),
    [branches],
  );

  const [selectedId, setSelectedId] =
    useState<number | null>(
      activeBranches[0]?.id ?? null,
    );

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  /*
   * Tidak menggunakan effect untuk melakukan
   * setState. Ini menghindari warning React
   * set-state-in-effect yang sebelumnya muncul.
   */
  const selectedBranch =
    activeBranches.find(
      (branch) =>
        branch.id === selectedId,
    ) ?? activeBranches[0];

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setDropdownOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  function selectBranch(
    branchId: number,
  ) {
    setSelectedId(branchId);
    setDropdownOpen(false);
  }

  if (
    activeBranches.length === 0 ||
    !selectedBranch
  ) {
    return null;
  }

  const mapEmbedUrl =
    buildMapEmbedUrl(selectedBranch);

  const googleMapsLink =
    buildGoogleMapsLink(selectedBranch);

  return (
    <section
      id="lokasi"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container-page">
        <div className="max-w-xl">
          <h2 className="text-[clamp(2rem,7vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-(--ink)">
            Lokasi kos
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-(--stone) sm:text-base">
            Pilih cabang untuk melihat
            alamat, patokan, dan lokasi
            Kos Omah Subardiman.
          </p>
        </div>

        {activeBranches.length > 1 && (
          <div
            ref={dropdownRef}
            className="relative mt-7 lg:hidden"
          >
            <button
              type="button"
              onClick={() =>
                setDropdownOpen(
                  (current) => !current,
                )
              }
              aria-expanded={dropdownOpen}
              className="flex min-h-12 w-full items-center justify-between border border-(--line) bg-white px-4 text-left"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  Cabang
                </p>

                <p className="mt-1 text-sm font-semibold text-(--ink)">
                  {selectedBranch.nama}
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`text-(--stone) transition-transform ${
                  dropdownOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden border border-(--line) bg-white shadow-lg">
                {activeBranches.map(
                  (branch) => {
                    const selected =
                      branch.id ===
                      selectedBranch.id;

                    return (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() =>
                          selectBranch(
                            branch.id,
                          )
                        }
                        className="flex min-h-12 w-full items-center justify-between px-4 text-left transition hover:bg-(--background)"
                      >
                        <span
                          className={
                            selected
                              ? "font-semibold text-(--ink)"
                              : "text-(--stone)"
                          }
                        >
                          {branch.nama}
                        </span>

                        {selected && (
                          <Check
                            size={17}
                            className="text-(--accent)"
                          />
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>
        )}

        {activeBranches.length > 1 && (
          <div className="mt-7 hidden gap-2 overflow-x-auto pb-1 lg:flex">
            {activeBranches.map(
              (branch) => {
                const selected =
                  branch.id ===
                  selectedBranch.id;

                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() =>
                      selectBranch(
                        branch.id,
                      )
                    }
                    className={`shrink-0 border px-4 py-2.5 text-xs font-semibold transition ${
                      selected
                        ? "border-(--ink) bg-(--ink) text-white!"
                        : "border-(--line) bg-white text-(--stone) hover:border-(--ink) hover:text-(--ink)"
                    }`}
                  >
                    {branch.nama}
                  </button>
                );
              },
            )}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:gap-8">
          <div className="border border-(--line) bg-(--background) p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center bg-(--ink) text-white!">
                <MapPin size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  {selectedBranch.nama}
                </p>

                <p className="mt-2 text-sm leading-6 text-(--ink)">
                  {selectedBranch.alamat}
                </p>

                <p className="mt-1 text-sm leading-6 text-(--stone)">
                  {selectedBranch.kota}
                </p>
              </div>
            </div>

            {selectedBranch.patokan && (
              <div className="mt-6 border-t border-(--line) pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  Patokan
                </p>

                <p className="mt-2 text-sm leading-6 text-(--stone)">
                  {selectedBranch.patokan}
                </p>
              </div>
            )}

            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 border border-(--ink) px-4 py-2.5 text-xs font-semibold text-(--ink) transition hover:bg-(--accent-dark) hover:text-white!"
            >
              Buka di Google Maps
              <ExternalLink size={15} />
            </a>
          </div>

          <div className="relative min-h-90 overflow-hidden border border-(--line) bg-(--cream) sm:min-h-107.5 lg:min-h-full">
            <iframe
              key={`${selectedBranch.id}-${selectedBranch.latitude}-${selectedBranch.longitude}`}
              src={mapEmbedUrl}
              title={`Lokasi ${selectedBranch.nama}`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}