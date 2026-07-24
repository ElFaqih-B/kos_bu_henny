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
    <header
      className="
        sticky top-0 z-50
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
            className="
              font-(--font-fraunces)
              text-xl
              font-medium
              tracking-[-0.02em]
            "
            onClick={handleMenuClose}
          >
            Kos Bu Henny
          </a>

          {/* Desktop navigation */}
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
              <MessageCircle
                size={17}
                aria-hidden="true"
              />

              Tanya Kamar
            </a>
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={handleMenuToggle}
            aria-label={
              isOpen
                ? "Tutup menu navigasi"
                : "Buka menu navigasi"
            }
            aria-expanded={isOpen}
            className="
              inline-flex
              size-11
              items-center
              justify-center
              rounded-lg
              border
              border-white/15
              text-(--cream)
              transition-colors
              hover:bg-white/10
              md:hidden
            "
          >
            {isOpen ? (
              <X
                size={21}
                aria-hidden="true"
              />
            ) : (
              <Menu
                size={21}
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div
            className="
              border-t
              border-white/10
              pb-5
              pt-3
              md:hidden
            "
          >
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
              "
            >
              <MessageCircle
                size={17}
                aria-hidden="true"
              />

              Tanya Kamar
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}