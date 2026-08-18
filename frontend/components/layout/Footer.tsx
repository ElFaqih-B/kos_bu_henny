import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  MessageCircle,
} from "lucide-react";

type FooterProps = {
  name: string;
  whatsappUrl?: string | null;
  tiktokUrl?: string | null;
};

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.589 7.3a5.4 5.4 0 0 1-3.13-1.003 5.42 5.42 0 0 1-1.875-2.557A5.4 5.4 0 0 1 14.32 2h-3.19v13.633a2.96 2.96 0 0 1-2.96 2.963 2.96 2.96 0 0 1-2.96-2.963 2.96 2.96 0 0 1 2.96-2.96c.307 0 .603.047.88.134v-3.25a6.2 6.2 0 0 0-.88-.063A6.15 6.15 0 0 0 2.02 15.633 6.15 6.15 0 0 0 8.17 21.78a6.15 6.15 0 0 0 6.15-6.147V8.72a8.57 8.57 0 0 0 5.27 1.82V7.35a5.43 5.43 0 0 1 0-.05Z" />
    </svg>
  );
}

export default function Footer({
  name,
  whatsappUrl,
  tiktokUrl,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-(--ink) text-white">
      <div className="container-page">
        {/* Main footer */}
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.5fr_0.7fr_0.8fr] lg:gap-16 lg:py-20">
          {/* Brand */}
          <div className="max-w-lg">
            <h2 className="font-(family-name:--font-fraunces) text-2xl font-semibold tracking-tight sm:text-3xl">
              {name}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/65 sm:text-[0.95rem]">
              Temukan pilihan kamar, fasilitas, harga, dan lokasi
              Kos Omah Subardiman dengan informasi yang jelas dan
              mudah diakses.
            </p>

            <div className="mt-6 flex items-start gap-2.5 text-sm text-white/50">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0"
              />

              <span>
                Lihat lokasi dan alamat setiap cabang pada bagian
                lokasi.
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/40">
              Navigasi
            </p>

            <nav className="mt-5 flex flex-col items-start gap-3.5">
              <Link
                href="/#kamar"
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                Pilihan kamar
              </Link>

              <Link
                href="/#galeri"
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                Galeri
              </Link>

              <Link
                href="/#lokasi"
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                Lokasi
              </Link>

              <Link
                href="/#tentang"
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                Tentang kami
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/40">
              Hubungi
            </p>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 flex w-full items-center gap-3 border border-white/10 px-4 py-3.5 transition-colors hover:bg-green-900"
              >
                <MessageCircle
                  size={17}
                  className="shrink-0"
                />

                <span className="text-sm font-medium">
                  WhatsApp
                </span>

                <ArrowUpRight
                  size={15}
                  className="ml-auto text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                />
              </a>
            ) : (
              <p className="mt-5 text-sm leading-6 text-white/40">
                Informasi kontak belum tersedia.
              </p>
            )}

            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 flex w-full items-center gap-3 border border-white/10 px-4 py-3.5 transition-colors hover:border-white/25 hover:bg-(--tiktok)"
              >
                <TikTokIcon size={18} />

                <span className="text-sm font-medium">
                  TikTok
                </span>

                <ArrowUpRight
                  size={15}
                  className="ml-auto text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                />
              </a>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10">
          <div className="flex flex-col gap-3 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {name}
            </p>

            <p>
              Informasi kamar dan ketersediaan dapat berubah
              sewaktu-waktu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}