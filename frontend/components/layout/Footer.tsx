import Link from "next/link";
import {
  ExternalLink,
  MapPin,
  MessageCircle,
} from "lucide-react";


type FooterProps = {
  name: string;
  whatsappUrl?: string | null;
  instagramUrl?: string | null;
};


export default function Footer({
  name,
  whatsappUrl,
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

            <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
              Temukan pilihan kamar, fasilitas,
              harga, dan lokasi kos dengan informasi
              yang mudah diakses.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-white/50">
              <MapPin size={15} />
              <span>
                Lihat lokasi cabang pada bagian lokasi
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
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
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              Hubungi
            </p>

            <div className="mt-4 flex flex-col items-start gap-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 text-sm text-white/70 transition hover:text-white"
                >
                  <MessageCircle size={16} />

                  <span>
                    WhatsApp
                  </span>

                  <ExternalLink
                    size={13}
                    className="opacity-40 transition group-hover:opacity-100"
                  />
                </a>
              )}
              {!whatsappUrl && (
                <p className="text-sm text-white/40">
                  Informasi kontak belum tersedia.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {name}
          </p>

          <p>
            Informasi kamar dan ketersediaan dapat
            berubah sewaktu-waktu.
          </p>
        </div>
      </div>
    </footer>
  );
}