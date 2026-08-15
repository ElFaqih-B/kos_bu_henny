import Link from "next/link";
import { ExternalLink, MapPin, MessageCircle } from "lucide-react";

type FooterProps = {
  name: string;
  whatsappUrl?: string | null;
  tiktokUrl?: string | null;
};

function TikTokIcon({ size = 20 }: { size?: number }) {
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
        {/* Main */}
        <div className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[1.3fr_0.7fr_0.8fr] lg:gap-16 lg:py-16">
          {/* Identity */}
          <div className="max-w-md">
            <h2 className="font-(family-name:--font-fraunces) text-2xl font-semibold tracking-[-0.02em]">
              {name}
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-white/90">
              Temukan pilihan kamar, fasilitas, harga, dan lokasi kos dengan
              informasi yang mudah diakses.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-white/70">
              <MapPin size={15} />

              <span>
                Lihat lokasi cabang pada bagian lokasi
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
              Navigasi
            </p>

            <nav className="mt-4 flex flex-col items-start gap-3">
              <Link
                href="/#kamar"
                className="text-sm text-white/70 transition hover:text-white"
              >
                Pilihan kamar
              </Link>

              <Link
                href="/#galeri"
                className="text-sm text-white/70 transition hover:text-white"
              >
                Galeri
              </Link>

              <Link
                href="/#lokasi"
                className="text-sm text-white/70 transition hover:text-white"
              >
                Lokasi
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
              Hubungi
            </p>

            <div className="mt-4 rounded-lg bg-(--accent) p-4 transition hover:bg-(--accent-dark)">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-sm font-bold text-white"
                >
                  <MessageCircle size={16} />

                  <span>WhatsApp</span>

                  <ExternalLink
                    size={13}
                    className="ml-auto opacity-80 transition group-hover:opacity-100"
                  />
                </a>
              ) : (
                <p className="text-sm text-white/60">
                  Informasi kontak belum tersedia.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media */}
        {tiktokUrl && (
          <div className="border-t border-white/10 py-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
              Media sosial
            </p>

            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Kos Omah Subardiman"
              className="group mt-4 inline-flex items-center gap-2.5 text-sm text-white/70 transition hover:text-white"
            >
              <TikTokIcon size={20} />

              <span>TikTok</span>

              <ExternalLink
                size={13}
                className="opacity-60 transition group-hover:opacity-100"
              />
            </a>
          </div>
        )}

        {/* Bottom */}
        <div className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/90 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {name}
          </p>

          <p>
            Informasi kamar dan ketersediaan dapat berubah sewaktu-waktu.
          </p>
        </div>
      </div>
    </footer>
  );
}