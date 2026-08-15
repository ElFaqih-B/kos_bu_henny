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


function buildMapEmbedUrl(
  branch: Cabang,
) {
  const query = [
    branch.alamat,
    branch.kota,
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps?q=${encodeURIComponent(
    query,
  )}&output=embed`;
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
            a.urutan - b.urutan,
        ),
    [branches],
  );

  const [selectedId, setSelectedId] =
    useState<number | null>(
      activeBranches[0]?.id ?? null,
    );

  const [
    dropdownOpen,
    setDropdownOpen,
  ] = useState(false);

  const selectedBranch =
    activeBranches.find(
      (branch) =>
        branch.id === selectedId,
    ) ?? activeBranches[0];

  useEffect(() => {
    const closeDropdown = (
      event: MouseEvent,
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setDropdownOpen(false);
      }
    };

    const closeWithEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      closeDropdown,
    );

    document.addEventListener(
      "keydown",
      closeWithEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeDropdown,
      );

      document.removeEventListener(
        "keydown",
        closeWithEscape,
      );
    };
  }, []);

  const selectBranch = (
    branchId: number,
  ) => {
    setSelectedId(branchId);
    setDropdownOpen(false);
  };

  if (
    !activeBranches.length ||
    !selectedBranch
  ) {
    return null;
  }

  const mapEmbedUrl =
    buildMapEmbedUrl(
      selectedBranch,
    );

  return (
    <section
      id="lokasi"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container-page">
        {/* Heading */}
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

        {/* Branch Selector */}
        <div className="mt-7">
          {/* Mobile Dropdown */}
          {activeBranches.length > 1 && (
            <div
              ref={dropdownRef}
              className="relative lg:hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setDropdownOpen(
                    (current) =>
                      !current,
                  )
                }
                aria-expanded={
                  dropdownOpen
                }
                className="
                  flex min-h-11 w-full
                  items-center justify-between
                  gap-4 rounded-lg
                  border border-(--line)
                  bg-white px-4
                  text-sm
                  transition
                  hover:border-(--line-strong)
                "
              >
                <span className="text-(--stone)">
                  Cabang
                </span>

                <span className="ml-auto truncate font-medium text-(--ink)">
                  {selectedBranch.nama}
                </span>

                <ChevronDown
                  size={17}
                  className={`
                    shrink-0 text-(--stone)
                    transition-transform duration-200
                    ${
                      dropdownOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="
                    absolute inset-x-0 top-full
                    z-30 mt-2
                    max-h-64 overflow-y-auto
                    rounded-lg
                    border border-(--line)
                    bg-white p-1.5
                    shadow-[0_12px_30px_rgba(50,45,41,0.12)]
                  "
                >
                  {activeBranches.map(
                    (branch) => {
                      const active =
                        selectedBranch.id ===
                        branch.id;

                      return (
                        <button
                          key={
                            branch.id
                          }
                          type="button"
                          onClick={() =>
                            selectBranch(
                              branch.id,
                            )
                          }
                          className={`
                            flex min-h-11 w-full
                            items-center justify-between
                            gap-3 rounded-md
                            px-3 text-left
                            text-sm transition
                            ${
                              active
                                ? "bg-(--cream) font-semibold text-(--ink)"
                                : "font-medium text-(--ink-soft) hover:bg-(--cream)"
                            }
                          `}
                        >
                          <span className="truncate">
                            {
                              branch.nama
                            }
                          </span>

                          {active && (
                            <Check
                              size={17}
                              className="shrink-0 text-(--accent)"
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

          {/* Desktop Tabs */}
          {activeBranches.length > 1 && (
            <div className="hidden flex-wrap gap-2 lg:flex">
              {activeBranches.map(
                (branch) => {
                  const active =
                    selectedBranch.id ===
                    branch.id;

                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() =>
                        selectBranch(
                          branch.id,
                        )
                      }
                      className={`
                        min-h-10 rounded-lg
                        border px-4
                        text-sm font-medium
                        transition
                        ${
                          active
                            ? "bg-(--ink) text-white!"
                            : "border-(--line) bg-white text-(--ink) hover:border-(--line-strong)"
                        }
                      `}
                    >
                      {branch.nama}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>

        {/* Location Content */}
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:gap-5">
          {/* Map */}
          <div
            className="
              relative min-h-80
              overflow-hidden
              rounded-xl 
              bg-(--parchment)
              sm:min-h-100
              lg:min-h-115
            "
          >
            <iframe
              key={selectedBranch.id}
              src={mapEmbedUrl}
              title={`Lokasi ${selectedBranch.nama}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
            />
          </div>

          {/* Information */}
          <div
            className="
              flex flex-col
              rounded-xl
              bg-(--cream)
              p-5
              sm:p-6
              lg:p-7
            "
          >
            {/* Location Icon */}
            <div
              className="
                grid size-10
                place-items-center
                rounded-lg
                bg-white
                text-(--accent)
              "
            >
              <MapPin size={19} />
            </div>

            {/* Branch */}
            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-widest text-(--stone)">
                Cabang
              </p>

              <h3 className="mt-1 font-(family-name:--font-fraunces) text-2xl font-semibold tracking-[-0.02em] text-(--ink)">
                {selectedBranch.nama}
              </h3>

              <p className="mt-1 text-sm text-(--stone)">
                {selectedBranch.kota}
              </p>
            </div>

            {/* Address */}
            <div className="mt-6 border-t border-(--line) pt-5">
              <p className="text-xs font-medium uppercase tracking-widest text-(--stone)">
                Alamat
              </p>

              <p className="mt-2 text-sm leading-6 text-(--ink-soft)">
                {
                  selectedBranch.alamat
                }
              </p>
            </div>

            {/* Landmark */}
            {selectedBranch.patokan && (
              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-widest text-(--stone)">
                  Patokan
                </p>

                <p className="mt-2 text-sm leading-6 text-(--ink-soft)">
                  {
                    selectedBranch.patokan
                  }
                </p>
              </div>
            )}

            {/* Description */}
            {selectedBranch.deskripsi && (
              <div className="mt-5">
                <p className="text-sm leading-6 text-(--stone)">
                  {
                    selectedBranch.deskripsi
                  }
                </p>
              </div>
            )}

            {/* Google Maps */}
            {selectedBranch.url_maps && (
              <a
                href={
                  selectedBranch.url_maps
                }
                target="_blank"
                rel="noreferrer"
                className="
                  mt-7 flex min-h-11
                  items-center justify-center
                  gap-2 rounded-lg
                  border border-(--line-strong)
                  bg-white px-4
                  text-sm font-semibold
                  text-(--ink)
                  transition
                  hover:border-(--ink)
                  hover:bg-white/70
                  lg:mt-auto
                "
              >
                Buka Google Maps
                <ExternalLink
                  size={16}
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}