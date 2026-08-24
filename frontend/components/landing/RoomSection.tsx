// components/landing/RoomSection.tsx

"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import SearchBar from "@/components/ui/SearchBar";
import type { Kamar } from "@/lib/types";

import RoomCard from "./RoomCard";
import RoomDetailModal from "./RoomDetailModal";

type RoomSectionProps = {
  rooms: Kamar[];
  whatsappNumber?: string | null;
};

const ROOMS_PER_PAGE = 3;

export default function RoomSection({
  rooms,
  whatsappNumber,
}: RoomSectionProps) {
  const carouselRef =
    useRef<HTMLDivElement>(null);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [selectedRoom, setSelectedRoom] =
    useState<Kamar | null>(null);

  const [selectedBranch, setSelectedBranch] =
    useState("Semua");

  const [search, setSearch] =
    useState("");

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [page, setPage] =
    useState(0);

  const activeRooms = useMemo(
    () =>
      [...rooms]
        .filter((room) => room.aktif)
        .sort(
          (a, b) =>
            a.urutan - b.urutan,
        ),
    [rooms],
  );

  const branches = useMemo(() => {
    const names = activeRooms
      .map(
        (room) =>
          room.cabang?.nama,
      )
      .filter(
        (name): name is string =>
          Boolean(name),
      );

    return [
      "Semua",
      ...Array.from(
        new Set(names),
      ),
    ];
  }, [activeRooms]);

  const filteredRooms = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return activeRooms.filter(
      (room) => {
        const matchBranch =
          selectedBranch === "Semua" ||
          room.cabang?.nama ===
            selectedBranch;

        if (!matchBranch) {
          return false;
        }

        if (!keyword) {
          return true;
        }

        const searchableText = [
          room.nama,
          room.tipe,
          room.ukuran,
          room.deskripsi,
          room.cabang?.nama,
          ...(room.fasilitas ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          keyword,
        );
      },
    );
  }, [
    activeRooms,
    search,
    selectedBranch,
  ]);

  const totalPages = Math.max(
    Math.ceil(
      filteredRooms.length /
        ROOMS_PER_PAGE,
    ),
    1,
  );

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

  useEffect(() => {
    if (page >= totalPages) {
      setPage(
        Math.max(totalPages - 1, 0),
      );
    }
  }, [page, totalPages]);

  const scrollToStart = () => {
    carouselRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  };

  const changeSearch = (
    value: string,
  ) => {
    setSearch(value);
    setPage(0);
    scrollToStart();
  };

  const changeBranch = (
    branch: string,
  ) => {
    setSelectedBranch(branch);
    setDropdownOpen(false);
    setPage(0);
    scrollToStart();
  };

  const resetFilter = () => {
    setSearch("");
    setSelectedBranch("Semua");
    setDropdownOpen(false);
    setPage(0);
    scrollToStart();
  };

  const scrollMobile = (
    direction:
      | "left"
      | "right",
  ) => {
    const carousel =
      carouselRef.current;

    if (!carousel) {
      return;
    }

    const card =
      carousel.firstElementChild as
        | HTMLElement
        | null;

    const distance = card
      ? card.offsetWidth + 12
      : carousel.clientWidth * 0.85;

    carousel.scrollBy({
      left:
        direction === "right"
          ? distance
          : -distance,
      behavior: "smooth",
    });
  };

  const previousPage = () => {
    setPage((current) =>
      Math.max(current - 1, 0),
    );
  };

  const nextPage = () => {
    setPage((current) =>
      Math.min(
        current + 1,
        totalPages - 1,
      ),
    );
  };

  if (!activeRooms.length) {
    return null;
  }

  return (
    <>
      <section
        id="kamar"
        className="
          overflow-hidden
          bg-(--cream)
          py-16
          sm:py-20
          lg:py-24
        "
      >
        <div className="container-page">
          <div className="max-w-xl">
            <h2
              className="
                text-[clamp(2rem,7vw,3.5rem)]
                leading-[1.05]
                tracking-[-0.03em]
                text-(--ink)
              "
            >
              Pilihan kamar
            </h2>

            <p
              className="
                mt-3
                max-w-lg
                text-sm
                leading-6
                text-(--stone)
                sm:text-base
              "
            >
              Lihat pilihan kamar
              yang tersedia dan
              sesuaikan dengan
              kebutuhanmu.
            </p>
          </div>

          <div
            className="
              mt-6
              grid
              gap-3
              lg:grid-cols-[
                minmax(280px,360px)_1fr
              ]
              lg:items-center
            "
          >
            <SearchBar
              value={search}
              onChange={changeSearch}
              placeholder="
                Cari kamar, fasilitas,
                atau tipe...
              "
            />

            {branches.length > 2 && (
              <div
                ref={dropdownRef}
                className="
                  relative
                  lg:hidden
                "
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
                    flex
                    min-h-11
                    w-full
                    items-center
                    justify-between
                    gap-4
                    rounded-lg
                    border
                    border-(--line)
                    bg-white
                    px-4
                    text-sm
                  "
                >
                  <span className="text-(--stone)">
                    Cabang
                  </span>

                  <span
                    className="
                      ml-auto
                      truncate
                      font-medium
                      text-(--ink)
                    "
                  >
                    {selectedBranch ===
                    "Semua"
                      ? "Semua cabang"
                      : selectedBranch}
                  </span>

                  <ChevronDown
                    size={17}
                    className={`
                      shrink-0
                      text-(--stone)
                      transition-transform
                      duration-200
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
                      absolute
                      inset-x-0
                      top-full
                      z-30
                      mt-2
                      max-h-64
                      overflow-y-auto
                      rounded-lg
                      border
                      border-(--line)
                      bg-white
                      p-1.5
                      shadow-[0_12px_30px_rgba(50,45,41,0.12)]
                    "
                  >
                    {branches.map(
                      (branch) => {
                        const active =
                          selectedBranch ===
                          branch;

                        return (
                          <button
                            key={branch}
                            type="button"
                            onClick={() =>
                              changeBranch(
                                branch,
                              )
                            }
                            className={`
                              flex
                              min-h-11
                              w-full
                              items-center
                              justify-between
                              gap-3
                              rounded-md
                              px-3
                              text-left
                              text-sm
                              transition
                              ${
                                active
                                  ? "bg-(--cream) font-semibold text-(--ink)"
                                  : "font-medium text-(--ink-soft) hover:bg-(--cream)"
                              }
                            `}
                          >
                            <span className="truncate">
                              {branch ===
                              "Semua"
                                ? "Semua cabang"
                                : branch}
                            </span>

                            {active && (
                              <Check
                                size={17}
                                className="
                                  shrink-0
                                  text-(--accent)
                                "
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

            {branches.length > 2 && (
              <div
                className="
                  hidden
                  flex-wrap
                  justify-end
                  gap-2
                  lg:flex
                "
              >
                {branches.map(
                  (branch) => {
                    const active =
                      selectedBranch ===
                      branch;

                    return (
                      <button
                        key={branch}
                        type="button"
                        onClick={() =>
                          changeBranch(
                            branch,
                          )
                        }
                        className={`
                          min-h-10
                          rounded-lg
                          border
                          px-4
                          text-sm
                          font-medium
                          transition
                          ${
                            active
                              ? "border-(--ink) bg-(--ink) text-white"
                              : "border-(--line) bg-white text-(--ink) hover:border-(--line-strong)"
                          }
                        `}
                      >
                        {branch ===
                        "Semua"
                          ? "Semua"
                          : branch}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {(search ||
            selectedBranch !==
              "Semua") && (
            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <p
                className="
                  text-xs
                  text-(--stone)
                "
              >
                {filteredRooms.length}{" "}
                kamar ditemukan
              </p>

              <button
                type="button"
                onClick={resetFilter}
                className="
                  text-xs
                  font-semibold
                  text-(--accent)
                  transition
                  hover:text-(--accent-dark)
                "
              >
                Reset filter
              </button>
            </div>
          )}

          {!filteredRooms.length && (
            <div
              className="
                mt-8
                rounded-[10px]
                border
                border-(--line)
                bg-white
                px-5
                py-10
                text-center
              "
            >
              <p className="font-medium text-(--ink)">
                Kamar tidak ditemukan
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-(--stone)
                "
              >
                Coba ubah pencarian
                atau cabang.
              </p>
            </div>
          )}

          {filteredRooms.length > 0 && (
            <div
              className="
                relative
                mt-8
                lg:hidden
              "
            >
              {filteredRooms.length >
                1 && (
                <div
                  className="
                    mb-3
                    flex
                    justify-end
                    gap-2
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      scrollMobile(
                        "left",
                      )
                    }
                    aria-label="
                      Kamar sebelumnya
                    "
                    className="
                      grid
                      size-11
                      place-items-center
                      rounded-lg
                      border
                      border-(--line)
                      bg-white
                      text-(--ink)
                      transition
                      active:scale-95
                    "
                  >
                    <ChevronLeft
                      size={19}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      scrollMobile(
                        "right",
                      )
                    }
                    aria-label="
                      Kamar berikutnya
                    "
                    className="
                      grid
                      size-11
                      place-items-center
                      rounded-lg
                      border
                      border-(--line)
                      bg-white
                      text-(--ink)
                      transition
                      active:scale-95
                    "
                  >
                    <ChevronRight
                      size={19}
                    />
                  </button>
                </div>
              )}

              <div
                ref={carouselRef}
                className="
                  mx-[-8vw]
                  flex
                  snap-x
                  snap-mandatory
                  gap-3
                  overflow-x-auto
                  scroll-smooth
                  overscroll-x-contain
                  px-[16vw]
                  pb-2
                  scrollbar-none
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {filteredRooms.map(
                  (room) => (
                    <div
                      key={room.id}
                      className="
                        w-[84vw]
                        max-w-80
                        shrink-0
                        snap-center
                        snap-always
                      "
                    >
                      <RoomCard
                        room={room}
                        whatsappNumber={
                          whatsappNumber
                        }
                        onDetail={() =>
                          setSelectedRoom(
                            room,
                          )
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {filteredRooms.length > 0 && (
            <div
              className="
                mt-10
                hidden
                lg:block
              "
            >
              <div className="overflow-hidden">
                <div
                  className="
                    flex
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                  "
                  style={{
                    transform:
                      `translateX(-${page * 100}%)`,
                  }}
                >
                  {Array.from({
                    length: totalPages,
                  }).map(
                    (_, pageIndex) => {
                      const start =
                        pageIndex *
                        ROOMS_PER_PAGE;

                      const pageRooms =
                        filteredRooms.slice(
                          start,
                          start +
                            ROOMS_PER_PAGE,
                        );

                      return (
                        <div
                          key={
                            pageIndex
                          }
                          className="
                            w-full
                            shrink-0
                          "
                        >
                          <div
                            className="
                              grid
                              grid-cols-3
                              gap-5
                            "
                          >
                            {pageRooms.map(
                              (room) => (
                                <RoomCard
                                  key={
                                    room.id
                                  }
                                  room={
                                    room
                                  }
                                  whatsappNumber={
                                    whatsappNumber
                                  }
                                  desktop
                                  onDetail={() =>
                                    setSelectedRoom(
                                      room,
                                    )
                                  }
                                />
                              ),
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {totalPages > 1 && (
                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    border-t
                    border-(--line)
                    pt-5
                  "
                >
                  <p
                    className="
                      text-sm
                      text-(--stone)
                    "
                  >
                    {page + 1} dari{" "}
                    {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={
                        previousPage
                      }
                      disabled={page === 0}
                      aria-label="
                        Halaman kamar sebelumnya
                      "
                      className="
                        grid
                        size-11
                        place-items-center
                        rounded-lg
                        border
                        border-(--line)
                        bg-white
                        text-(--ink)
                        transition
                        hover:border-(--line-strong)
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                      "
                    >
                      <ChevronLeft
                        size={19}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        nextPage
                      }
                      disabled={
                        page ===
                        totalPages - 1
                      }
                      aria-label="
                        Halaman kamar berikutnya
                      "
                      className="
                        grid
                        size-11
                        place-items-center
                        rounded-lg
                        border
                        border-(--line)
                        bg-white
                        text-(--ink)
                        transition
                        hover:border-(--line-strong)
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                      "
                    >
                      <ChevronRight
                        size={19}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <RoomDetailModal
        room={selectedRoom}
        whatsappNumber={whatsappNumber}
        onClose={() =>
          setSelectedRoom(null)
        }
      />
    </>
  );
}