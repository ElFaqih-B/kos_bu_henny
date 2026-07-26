import { MessageCircle } from "lucide-react";
import type { Pengaturan } from "@/lib/types";

export default function Footer({
  settings,
  whatsapp,
}: {
  settings: Pengaturan;
  whatsapp: string | null;
}) {
  return (
    <footer className="bg-[var(--ink)] pt-14 text-white md:pt-20">
      <div className="container-page grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1fr_1fr_1.5fr]">
        <div>
          <h3 className="text-[18px] text-white">Halaman</h3>
          <nav className="mt-5 grid gap-3 text-sm text-white/58" aria-label="Navigasi footer">
            <a href="#beranda" className="transition-colors hover:text-white">Beranda</a>
            <a href="#galeri" className="transition-colors hover:text-white">Dokumentasi</a>
            <a href="#kamar" className="transition-colors hover:text-white">Pilihan Kamar</a>
            <a href="#fasilitas" className="transition-colors hover:text-white">Fasilitas</a>
          </nav>
        </div>

        <div>
          <h3 className="text-[18px] text-white">Informasi</h3>
          <nav className="mt-5 grid gap-3 text-sm text-white/58" aria-label="Informasi footer">
            <a href="#lokasi" className="transition-colors hover:text-white">Lokasi</a>
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                Instagram
              </a>
            )}
          </nav>
        </div>

        <div className="rounded-[10px] border border-white/10 bg-[var(--ink-soft)] p-6 md:p-7">
          <h2 className="text-[25px] leading-tight text-white">{settings.nama_kos}</h2>
          {settings.alamat && (
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/58">{settings.alamat}</p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-base btn-accent min-h-11 px-5 text-sm"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp Bu Henny
              </a>
            )}

            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="btn-base btn-light-outline min-h-11 px-5 text-sm"
              >
                <Instagram size={16} aria-hidden="true" />
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/48 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {settings.nama_kos}. Informasi dikelola oleh pemilik.</span>
        <strong className="font-editorial text-[15px] font-normal text-white">{settings.nama_kos}</strong>
      </div>
    </footer>
  );
}
