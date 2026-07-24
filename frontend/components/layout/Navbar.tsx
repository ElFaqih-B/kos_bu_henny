"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "Beranda",
    href: "#beranda",
  },
  {
    label: "Pilihan Kamar",
    href: "#kamar",
  },
  {
    label: "Fasilitas",
    href: "#fasilitas",
  },
  {
    label: "Dokumentasi",
    href: "#dokumentasi",
  },
  {
    label: "Lokasi",
    href: "#lokasi",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function handleMenuToggle() {
    setIsOpen((current) => !current);
  }

  function handleMenuClose() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Navbar */}
      <header
        className="
          sticky
          top-0
          z-50
          bg-(--ink)/90
          text-(--cream)
          backdrop-blur-md
        "
      >
        <nav className="container-page">
          <div className="flex min-h-16 items-center justify-between">
            {/* Brand */}
            <a
              href="#beranda"
              onClick={handleMenuClose}
              className="
                font-(family-name:--font-fraunces)
                text-xl
                font-medium
                tracking-[-0.02em]
              "
            >
              Kos Bu Henny
            </a>

            {/* Desktop menu */}
            <div className="hidden items-center gap-7 md:flex">
              <ul className="flex items-center gap-6">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="
                        text-sm
                        font-medium
                        text-white/75
                        transition-colors
                        hover:text-(--gold-light)
                      "
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href="#kamar"
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-(--gold)
                  px-4
                  text-sm
                  font-semibold
                  text-(--ink)
                  transition-colors
                  hover:bg-(--gold-light)
                "
              >
                <MessageCircle size={17} aria-hidden="true" />

                Tanya Kamar
              </a>
            </div>

            {/* Hamburger */}
            <button
              type="button"
              onClick={handleMenuToggle}
              aria-expanded={isOpen}
              aria-label={
                isOpen
                  ? "Tutup menu navigasi"
                  : "Buka menu navigasi"
              }
              className="
                inline-flex
                size-11
                items-center
                justify-center
                rounded-lg
                text-(--cream)
                transition-colors
                hover:bg-white/10
                md:hidden
              "
            >
              {isOpen ? (
                <X size={21} aria-hidden="true" />
              ) : (
                <Menu size={21} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Dropdown mobile */}
        <div
            className={`
                absolute
                left-0
                right-0
                top-full
                z-50

                border-t
                border-white/10

                bg-(--ink)/95
                shadow-lg
                backdrop-blur-xl

                origin-top
                transition-all
                duration-300
                ease-out

                md:hidden

                ${
                isOpen
                    ? "translate-y-0 opacity-100 visible"
                    : "-translate-y-3 opacity-0 invisible pointer-events-none"
                }
            `}
            >
            <div className="container-page pb-5 pt-3">
                <ul className="flex flex-col">
                {navigation.map((item) => (
                    <li key={item.href}>
                    <a
                        href={item.href}
                        onClick={handleMenuClose}
                        className="
                        flex
                        min-h-12
                        items-center
                        border-b
                        border-white/[0.07]
                        text-sm
                        font-medium
                        text-white/80
                        transition-colors
                        hover:text-(--gold-light)
                        "
                    >
                        {item.label}
                    </a>
                    </li>
                ))}
                </ul>

                <a
                href="#kamar"
                onClick={handleMenuClose}
                className="
                    mt-4
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-(--gold)
                    px-4
                    text-sm
                    font-semibold
                    text-(--ink)
                    transition-colors
                    hover:bg-(--gold-light)
                "
                >
                <MessageCircle size={17} aria-hidden="true" />
                Tanya Kamar
                </a>
            </div>
        </div>
      </header>

      {/* Blur background di belakang dropdown */}
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={handleMenuClose}
          className="
            fixed
            inset-x-0
            bottom-0
            top-16
            z-40
            bg-black/20
            backdrop-blur-md
            md:hidden
          "
        />
      )}
    </>
  );
}