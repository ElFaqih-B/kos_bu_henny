import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import GallerySection from "@/components/landing/GallerySection";
import RoomSection from "@/components/landing/RoomSection";
import { rupiah, whatsappUrl } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { serverGet } from "@/lib/server-api";

import type {
  Cabang,
  Dokumentasi,
  Kamar,
  Pengaturan,
} from "@/lib/types";

export default async function HomePage() {

  // Data
const [settings, rooms, branches, galleryItems] = await Promise.all([
  serverGet<Pengaturan>("pengaturan"),
  serverGet<Kamar[]>("kamar"),
  serverGet<Cabang[]>("cabang"),
  serverGet<Dokumentasi[]>("dokumentasi"),
]);

  // Hero Stats
  const prices = rooms.map((room) => room.harga_bulanan);

  const startingPrice =
    prices.length > 0
      ? Math.min(...prices)
      : 0;

  const availableRooms = rooms.reduce(
    (total, room) => total + room.kamar_tersedia,
    0,
  );

  const whatsapp = whatsappUrl(settings.nomor_whatsapp);

  return (
    <>
      {/* Navbar */}
      <Navbar whatsappUrl={whatsapp} />

      <main>

        {/* Hero */}
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
              value: rupiah(startingPrice),
            },
            {
              label: "Pilihan kamar",
              value: String(rooms.length),
            },
            {
              label: "Kamar tersedia",
              value: String(availableRooms),
            },
            {
              label: "Lokasi",
              value: String(branches.length),
            },
          ]}
        />

        {/* Dokumentasi */}
      <GallerySection items={galleryItems} />

      <RoomSection
        rooms={rooms}
        whatsappUrl={whatsapp}
      />

      </main>
    </>
  );
}