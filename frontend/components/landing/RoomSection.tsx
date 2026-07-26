"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  Kamar,
  Pengaturan,
} from "@/lib/types";

import RoomCard from "./RoomCard";


type RoomSectionProps = {
  rooms: Kamar[];
  settings: Pengaturan;
};


type BranchFilter =
  | number
  | "all";


const DESKTOP_PER_PAGE = 3;


export default function RoomSection({
  rooms,
  settings,
}: RoomSectionProps) {
  const sliderRef =
    useRef<HTMLDivElement>(null);

  const cardRefs =
    useRef<Array<HTMLDivElement | null>>([]);

  const [selectedBranch, setSelectedBranch] =
    useState<BranchFilter>("all");

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [desktopPage, setDesktopPage] =
    useState(0);


  /*
   * =========================
   * DATA KAMAR
   * =========================
   */

  const activeRooms = useMemo(
    () =>
      rooms.filter(
        (room) => room.aktif,
      ),
    [rooms],
  );


  /*
   * Ambil daftar cabang unik
   * dari data kamar backend.
   */
  const branches = useMemo(() => {
    const map = new Map<
      number,
      {
        id: number;
        nama: string;
      }
    >();

    activeRooms.forEach((room) => {
      if (!room.cabang) {
        return;
      }

      map.set(
        room.cabang.id,
        {
          id: room.cabang.id,
          nama: room.cabang.nama,
        },
      );
    });

    return Array.from(
      map.values(),
    );
  }, [activeRooms]);


  /*
   * Kamar setelah difilter cabang.
   */
  const visibleRooms = useMemo(
    () =>
      selectedBranch === "all"
        ? activeRooms
        : activeRooms.filter(
            (room) =>
              room.cabang_id ===
              selectedBranch,
          ),
    [
      activeRooms,
      selectedBranch,
    ],
  );


  /*
   * =========================
   * HELPER
   * =========================
   */

  function shortBranchName(
    name: string,
  ) {
    return name
      .replace(
        /^Kos Bu Henny\s*-\s*/i,
        "",
      )
      .trim();
  }


  /*
   * =========================
   * MOBILE / TABLET CAROUSEL
   * =========================
   */

  function goToSlide(
    index: number,
  ) {
    const total =
      visibleRooms.length;

    if (total === 0) {
      return;
    }

    const targetIndex =
      (
        index +
        total
      ) % total;

    const card =
      cardRefs.current[
        targetIndex
      ];

    if (!card) {
      return;
    }

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    setActiveIndex(
      targetIndex,
    );
  }


  function previousRoom() {
    goToSlide(
      activeIndex - 1,
    );
  }


  function nextRoom() {
    goToSlide(
      activeIndex + 1,
    );
  }


  /*
   * Saat user swipe manual,
   * cari card yang paling dekat
   * dengan tengah viewport slider.
   */
  function handleScroll() {
    const slider =
      sliderRef.current;

    if (!slider) {
      return;
    }

    const sliderRect =
      slider.getBoundingClientRect();

    const center =
      sliderRect.left +
      sliderRect.width / 2;

    let nearestIndex = 0;
    let nearestDistance =
      Infinity;

    cardRefs.current.forEach(
      (card, index) => {
        if (!card) {
          return;
        }

        const cardRect =
          card.getBoundingClientRect();

        const cardCenter =
          cardRect.left +
          cardRect.width / 2;

        const distance =
          Math.abs(
            center -
            cardCenter,
          );

        if (
          distance <
          nearestDistance
        ) {
          nearestDistance =
            distance;

          nearestIndex =
            index;
        }
      },
    );

    setActiveIndex(
      nearestIndex,
    );
  }


  /*
   * =========================
   * DESKTOP
   * =========================
   */

  const desktopTotalPages =
    Math.max(
      1,
      Math.ceil(
        visibleRooms.length /
        DESKTOP_PER_PAGE,
      ),
    );


  const desktopRooms =
    visibleRooms.slice(
      desktopPage *
        DESKTOP_PER_PAGE,

      desktopPage *
        DESKTOP_PER_PAGE +
        DESKTOP_PER_PAGE,
    );


  function previousDesktopPage() {
    setDesktopPage(
      (current) =>
        (
          current -
          1 +
          desktopTotalPages
        ) %
        desktopTotalPages,
    );
  }


  function nextDesktopPage() {
    setDesktopPage(
      (current) =>
        (
          current +
          1
        ) %
        desktopTotalPages,
    );
  }


  /*
   * Saat filter cabang berubah:
   * reset mobile dan desktop.
   */
  useEffect(() => {
    setActiveIndex(0);
    setDesktopPage(0);

    cardRefs.current = [];

    sliderRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }, [selectedBranch]);


  if (
    activeRooms.length === 0
  ) {
    return null;
  }


  return (
    <section
      id="kamar"
      className="
        overflow-hidden
        bg-white

        py-16

        sm:py-20
        lg:py-24
      "
    >
      {/* =========================
          HEADING
      ========================== */}
      <div className="container-page">
        <div
          className="
            mx-auto
            max-w-2xl
            text-center
          "
        >
          <h2
            className="
              text-[clamp(2rem,5vw,3.5rem)]
              leading-[1.05]
              tracking-[-0.03em]

              text-(--ink)
            "
          >
            Pilihan kamar
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl

              text-sm
              leading-6
              text-(--stone)

              sm:text-base
              sm:leading-7
            "
          >
            Temukan kamar sesuai
            kebutuhan dan lokasi
            yang kamu inginkan.
          </p>
        </div>


        {/* =========================
            FILTER CABANG
        ========================== */}
        {branches.length > 1 && (
          <div
            className="
              mt-7

              overflow-x-auto
              pb-2

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              sm:mt-8
            "
          >
            <div
              className="
                flex
                min-w-max
                items-center
                gap-2

                lg:justify-center
              "
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedBranch(
                    "all",
                  )
                }
                aria-pressed={
                  selectedBranch ===
                  "all"
                }
                className={`
                  min-h-10

                  rounded-[8px]
                  border

                  px-4

                  text-sm
                  font-medium

                  transition-colors

                  ${
                    selectedBranch ===
                    "all"
                      ? `
                        border-(--accent)
                        bg-(--accent)
                        !text-white
                      `
                      : `
                        border-(--line)
                        bg-white
                        text-(--stone)

                        hover:border-(--accent)
                        hover:text-(--accent)
                      `
                  }
                `}
              >
                Semua
              </button>


              {branches.map(
                (branch) => {
                  const isActive =
                    selectedBranch ===
                    branch.id;

                  return (
                    <button
                      key={
                        branch.id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedBranch(
                          branch.id,
                        )
                      }
                      aria-pressed={
                        isActive
                      }
                      className={`
                        min-h-10

                        rounded-[8px]
                        border

                        px-4

                        text-sm
                        font-medium

                        transition-colors

                        ${
                          isActive
                            ? `
                              border-(--accent)
                              bg-(--accent)
                              !text-white
                            `
                            : `
                              border-(--line)
                              bg-white
                              text-(--stone)

                              hover:border-(--accent)
                              hover:text-(--accent)
                            `
                        }
                      `}
                    >
                      {shortBranchName(
                        branch.nama,
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>


      {/* =========================
          EMPTY RESULT
      ========================== */}
      {visibleRooms.length ===
        0 && (
        <div
          className="
            container-page

            mt-12
            text-center
          "
        >
          <p
            className="
              text-sm
              text-(--stone)
            "
          >
            Belum ada kamar
            pada cabang ini.
          </p>
        </div>
      )}


      {/* =================================
          MOBILE / TABLET
      ================================= */}
      {visibleRooms.length >
        0 && (
        <div
          className="
            relative

            mt-9

            lg:hidden
          "
        >
          {/* Fade kiri */}
          <div
            className="
              pointer-events-none

              absolute
              inset-y-0
              left-0

              z-20

              w-[7%]

              bg-linear-to-r
              from-white
              via-white/60
              to-transparent
            "
          />


          {/* Fade kanan */}
          <div
            className="
              pointer-events-none

              absolute
              inset-y-0
              right-0

              z-20

              w-[7%]

              bg-linear-to-l
              from-white
              via-white/60
              to-transparent
            "
          />


          {/* Previous */}
          {visibleRooms.length >
            1 && (
            <button
              type="button"
              onClick={
                previousRoom
              }
              aria-label="Kamar sebelumnya"
              className="
                absolute
                left-2
                top-1/2

                z-30

                inline-flex
                size-11

                -translate-y-1/2

                items-center
                justify-center

                rounded-[8px]
                border
                border-(--line)

                bg-white/95
                text-(--ink)

                shadow-sm
                backdrop-blur-sm

                transition

                active:scale-95

                sm:left-4
              "
            >
              <ChevronLeft
                size={20}
                aria-hidden="true"
              />
            </button>
          )}


          {/* =========================
              NATIVE SLIDER
          ========================== */}
          <div
            ref={
              sliderRef
            }
            onScroll={
              handleScroll
            }
            className="
              flex

              snap-x
              snap-proximity

              touch-pan-x
              overscroll-x-contain

              items-stretch

              gap-3

              overflow-x-auto
              overflow-y-hidden

              scroll-smooth

              pb-5

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              sm:gap-4
            "
          >
            {/* Spacer kiri */}
            <div
              aria-hidden="true"
              className="
                w-[9%]
                shrink-0

                sm:w-[19%]

                md:w-[27%]
              "
            />


            {visibleRooms.map(
              (
                room,
                index,
              ) => {
                const isActive =
                  activeIndex ===
                  index;

                return (
                  <div
                    key={
                      room.id
                    }
                    ref={(
                      element,
                    ) => {
                      cardRefs.current[
                        index
                      ] =
                        element;
                    }}
                    className={`
                      w-[82%]
                      shrink-0

                      snap-center

                      transition-all
                      duration-300
                      ease-out

                      sm:w-[62%]

                      md:w-[46%]

                      ${
                        isActive
                          ? `
                            scale-100
                            opacity-100
                            blur-0
                          `
                          : `
                            scale-[0.96]
                            opacity-60
                            blur-[0.35px]
                          `
                      }
                    `}
                  >
                    <RoomCard
                      room={
                        room
                      }
                      settings={
                        settings
                      }
                    />
                  </div>
                );
              },
            )}


            {/* Spacer kanan */}
            <div
              aria-hidden="true"
              className="
                w-[9%]
                shrink-0

                sm:w-[19%]

                md:w-[27%]
              "
            />
          </div>


          {/* Next */}
          {visibleRooms.length >
            1 && (
            <button
              type="button"
              onClick={
                nextRoom
              }
              aria-label="Kamar berikutnya"
              className="
                absolute
                right-2
                top-1/2

                z-30

                inline-flex
                size-11

                -translate-y-1/2

                items-center
                justify-center

                rounded-[8px]
                border
                border-(--line)

                bg-white/95
                text-(--ink)

                shadow-sm
                backdrop-blur-sm

                transition

                active:scale-95

                sm:right-4
              "
            >
              <ChevronRight
                size={20}
                aria-hidden="true"
              />
            </button>
          )}


          {/* Indicators mobile */}
          {visibleRooms.length >
            1 && (
            <div
              className="
                mt-2

                flex
                items-center
                justify-center

                gap-2
              "
            >
              {visibleRooms.map(
                (
                  room,
                  index,
                ) => (
                  <button
                    key={
                      room.id
                    }
                    type="button"
                    onClick={() =>
                      goToSlide(
                        index,
                      )
                    }
                    aria-label={`Lihat ${room.nama}`}
                    aria-current={
                      activeIndex ===
                      index
                        ? "true"
                        : undefined
                    }
                    className={`
                      h-1.5

                      rounded-full

                      transition-all
                      duration-300

                      ${
                        activeIndex ===
                        index
                          ? `
                            w-7
                            bg-(--accent)
                          `
                          : `
                            w-1.5
                            bg-(--ink)/20
                          `
                      }
                    `}
                  />
                ),
              )}
            </div>
          )}
        </div>
      )}


      {/* =================================
          DESKTOP
      ================================= */}
      {visibleRooms.length >
        0 && (
        <div
          className="
            container-page

            mt-12

            hidden

            lg:block
          "
        >
          <div
            className="
              relative
            "
          >
            {/* Previous desktop */}
            {desktopTotalPages >
              1 && (
              <button
                type="button"
                onClick={
                  previousDesktopPage
                }
                aria-label="Halaman kamar sebelumnya"
                className="
                  absolute
                  -left-4
                  top-1/2

                  z-20

                  inline-flex
                  size-11

                  -translate-x-full
                  -translate-y-1/2

                  items-center
                  justify-center

                  rounded-[8px]
                  border
                  border-(--line)

                  bg-white
                  text-(--ink)

                  shadow-sm

                  transition-colors

                  hover:border-(--accent)
                  hover:text-(--accent)

                  xl:-left-6
                "
              >
                <ChevronLeft
                  size={20}
                  aria-hidden="true"
                />
              </button>
            )}


            {/* Desktop cards */}
            <div
              className="
                grid
                grid-cols-3

                items-stretch

                gap-5

                xl:gap-6
              "
            >
              {desktopRooms.map(
                (room) => (
                  <div
                    key={
                      room.id
                    }
                    className="
                      min-w-0
                    "
                  >
                    <RoomCard
                      room={
                        room
                      }
                      settings={
                        settings
                      }
                      compact
                    />
                  </div>
                ),
              )}
            </div>


            {/* Next desktop */}
            {desktopTotalPages >
              1 && (
              <button
                type="button"
                onClick={
                  nextDesktopPage
                }
                aria-label="Halaman kamar berikutnya"
                className="
                  absolute
                  -right-4
                  top-1/2

                  z-20

                  inline-flex
                  size-11

                  translate-x-full
                  -translate-y-1/2

                  items-center
                  justify-center

                  rounded-[8px]
                  border
                  border-(--line)

                  bg-white
                  text-(--ink)

                  shadow-sm

                  transition-colors

                  hover:border-(--accent)
                  hover:text-(--accent)

                  xl:-right-6
                "
              >
                <ChevronRight
                  size={20}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>


          {/* Desktop indicators */}
          {desktopTotalPages >
            1 && (
            <div
              className="
                mt-7

                flex
                items-center
                justify-center

                gap-2
              "
            >
              {Array.from({
                length:
                  desktopTotalPages,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <button
                    key={
                      index
                    }
                    type="button"
                    onClick={() =>
                      setDesktopPage(
                        index,
                      )
                    }
                    aria-label={`Halaman kamar ${index + 1}`}
                    aria-current={
                      desktopPage ===
                      index
                        ? "true"
                        : undefined
                    }
                    className={`
                      h-1.5

                      rounded-full

                      transition-all
                      duration-300

                      ${
                        desktopPage ===
                        index
                          ? `
                            w-7
                            bg-(--accent)
                          `
                          : `
                            w-1.5
                            bg-(--ink)/20
                          `
                      }
                    `}
                  />
                ),
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}