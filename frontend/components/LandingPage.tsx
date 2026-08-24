import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import AboutSection from "./landing/AboutSection";
import GallerySection from "./landing/GallerySection";
import HeroSection from "./landing/HeroSection";
import LocationSection from "./landing/LocationSection";
import RoomSection from "./landing/RoomSection";

import { mediaUrl } from "@/lib/media";
import { rupiah } from "@/lib/format";
import { serverGet } from "@/lib/server-api";
import { whatsappUrl } from "@/lib/whatsapp";

import type {
  Cabang,
  Dokumentasi,
  Kamar,
  Pengaturan,
} from "@/lib/types";

export default async function LandingPage() {
  const [settings, rooms, branches, galleryItems] =
    await Promise.all([
      serverGet<Pengaturan>("pengaturan"),
      serverGet<Kamar[]>("kamar"),
      serverGet<Cabang[]>("cabang"),
      serverGet<Dokumentasi[]>("dokumentasi"),
    ]);

  const activeRooms = rooms.filter((room) => room.aktif);
  const activeBranches = branches.filter((branch) => branch.aktif);

  const startingPrice =
    activeRooms.length > 0
      ? Math.min(
          ...activeRooms.map(
            (room) => room.harga_bulanan,
          ),
        )
      : 0;

  const availableRooms = activeRooms.reduce(
    (total, room) => total + room.kamar_tersedia,
    0,
  );

  const whatsapp = whatsappUrl(
    settings.nomor_whatsapp,
  );

  return (
    <>
      <Navbar whatsappUrl={whatsapp} />

      <main>
        <HeroSection
          imageUrl={mediaUrl(settings.hero_image) || ""}
          headline={settings.hero_headline}
          subheadline={settings.hero_subheadline}
          primaryLabel={settings.hero_cta_primary}
          primaryHref="#kamar"
          secondaryLabel={settings.hero_cta_secondary}
          secondaryHref={whatsapp || "#lokasi"}
          stats={[
            {
              label: "Harga mulai",
              value:
                startingPrice > 0
                  ? rupiah(startingPrice)
                  : "-",
            },
            {
              label: "Pilihan kamar",
              value: `${activeRooms.length} tipe`,
            },
            {
              label: "Kamar tersedia",
              value: `${availableRooms} kamar`,
            },
            {
              label: "Lokasi",
              value: `${activeBranches.length} cabang`,
            },
          ]}
        />

        <AboutSection name={settings.nama_kos} />

        <GallerySection items={galleryItems} />

        <RoomSection
          rooms={activeRooms}
          whatsappNumber={settings.nomor_whatsapp}
        />

        <LocationSection branches={activeBranches} />
      </main>

      <Footer
        name={settings.nama_kos}
        whatsappUrl={whatsapp}
        tiktokUrl={settings.tiktok_url}
      />
    </>
  );
}