"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";

type NavbarProps = {
  whatsappUrl?: string | null;
};

const navItems = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang", href: "#tentang" },
  { label: "Dokumentasi", href: "#dokumentasi" },
  { label: "Pilihan Kamar", href: "#kamar" },
  { label: "Lokasi", href: "#lokasi" },
];

export default function Navbar({ whatsappUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-(--ink) text-white">
        <div className="container-page flex min-h-16 items-center justify-between gap-4">

          {/* Brand */}
          <a
            href="#beranda"
            onClick={closeMenu}
            className="font-(family-name:--font-fraunces) text-[18px] font-medium tracking-[-0.02em] text-white! sm:text-[19px]"
          >
            Kos Bu Henny
          </a>

          {/* Menu Desktop */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-white/65! transition-colors hover:text-white!"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Desktop */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden min-h-10 items-center gap-2 rounded-lg bg-(--accent) px-4 text-[13px] font-semibold text-white! hover:bg-(--accent-dark) lg:inline-flex"
            >
              <MessageCircle size={16} />
              Tanya Kamar
            </a>
          )}

          {/* Hamburger Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            className="grid size-10 place-items-center rounded-lg lg:hidden hover:bg-white/10"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Mobile */}
        <div
          className={`absolute inset-x-0 top-full border-t border-white/10 bg-(--ink) transition-all duration-200 lg:hidden ${
            isOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <nav className="container-page flex flex-col py-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-12 items-center border-b border-white/8 text-sm font-medium text-white!/70 last:border-0"
              >
                {item.label}
              </a>
            ))}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
                className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-(--accent) text-sm font-semibold text-white!"
              >
                <MessageCircle size={16} />
                Tanya Kamar
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Backdrop Mobile */}
      <button
        type="button"
        aria-label="Tutup menu"
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}