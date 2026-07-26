"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["Beranda", "#beranda"],
  ["Dokumentasi", "#galeri"],
  ["Pilihan Kamar", "#kamar"],
  ["Fasilitas", "#fasilitas"],
  ["Lokasi", "#lokasi"],
] as const;

export default function Navbar({
  name,
  whatsapp,
}: {
  name: string;
  whatsapp: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[rgba(50,45,41,.93)] text-white backdrop-blur-md">
        <div className="container-page flex h-[66px] items-center justify-between gap-4 md:h-[72px]">
          <a
            href="#beranda"
            onClick={() => setOpen(false)}
            className="min-w-0 truncate font-editorial text-[20px] tracking-[-0.01em] md:text-[22px]"
          >
            {name}
          </a>

          <nav
            className="hidden items-center gap-7 text-[13px] font-medium text-white/75 lg:flex"
            aria-label="Navigasi utama"
          >
            {links.map(([label, href]) => (
              <a key={href} href={href} className="transition-colors hover:text-white">
                {label}
              </a>
            ))}

            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-base btn-accent min-h-11 px-5 text-[13px]"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Tanya Kamar
              </a>
            )}
          </nav>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>

        <nav
          aria-label="Navigasi mobile"
          aria-hidden={!open}
          className={`absolute inset-x-0 top-full z-50 border-t border-white/[0.08] bg-[rgba(50,45,41,.98)] shadow-[0_20px_45px_rgba(50,45,41,.24)] backdrop-blur-xl transition-all duration-300 ease-out lg:hidden ${
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible pointer-events-none -translate-y-3 opacity-0"
          }`}
        >
          <div className="container-page pb-5 pt-2">
            <div className="grid">
              {links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-white/[0.08] text-[14px] font-medium text-white/82 transition-colors hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>

            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="btn-base btn-accent mt-4 min-h-11 px-5 text-sm"
              >
                <MessageCircle size={17} aria-hidden="true" />
                Tanya Kamar
              </a>
            )}
          </div>
        </nav>
      </header>

      <button
        type="button"
        aria-label="Tutup menu navigasi"
        onClick={() => setOpen(false)}
        className={`fixed inset-x-0 bottom-0 top-[66px] z-40 bg-black/15 transition-all duration-300 ease-out md:top-[72px] lg:hidden ${
          open
            ? "pointer-events-auto opacity-100 backdrop-blur-md"
            : "pointer-events-none opacity-0 backdrop-blur-none"
        }`}
      />
    </>
  );
}
