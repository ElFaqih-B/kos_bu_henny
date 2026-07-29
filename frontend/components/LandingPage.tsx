import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import GallerySection from "./landing/GallerySection";
import HeroSection from "./landing/HeroSection";
import LocationSection from "./landing/LocationSection";
import RoomSection from "./landing/RoomSection";

import {
  rupiah,
  whatsappUrl,
} from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { serverGet } from "@/lib/server-api";

import type {
  Cabang,
  Dokumentasi,
  Kamar,
  Pengaturan,
} from "@/lib/types";


export default async function LandingPage() {
  // Data
  const [
    settings,
    rooms,
    branches,
    galleryItems,
  ] = await Promise.all([
    serverGet<Pengaturan>("pengaturan"),
    serverGet<Kamar[]>("kamar"),
    serverGet<Cabang[]>("cabang"),
    serverGet<Dokumentasi[]>("dokumentasi"),
  ]);

  // Summary
  const activeRooms = rooms.filter(
    (room) => room.aktif,
  );

  const activeBranches = branches.filter(
    (branch) => branch.aktif,
  );

  const prices = activeRooms.map(
    (room) => room.harga_bulanan,
  );

  const startingPrice =
    prices.length > 0
      ? Math.min(...prices)
      : 0;

  const availableRooms = activeRooms.reduce(
    (total, room) =>
      total + room.kamar_tersedia,
    0,
  );

  const whatsapp = whatsappUrl(
    settings.nomor_whatsapp,
  );

  return (
    <>
      {/* Navbar */}
      <Navbar
        whatsappUrl={whatsapp}
      />

      <main>
        {/* Hero */}
        <HeroSection
          imageUrl={
            mediaUrl(
              settings.hero_image,
            ) || ""
          }
          headline={
            settings.hero_headline
          }
          subheadline={
            settings.hero_subheadline
          }
          primaryLabel={
            settings.hero_cta_primary
          }
          primaryHref="#kamar"
          secondaryLabel={
            settings.hero_cta_secondary
          }
          secondaryHref={
            whatsapp || "#lokasi"
          }
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

        {/* Gallery */}
        <GallerySection
          items={galleryItems}
        />

        {/* Rooms */}
        <RoomSection
          rooms={activeRooms}
          whatsappUrl={whatsapp}
        />

        {/* Location */}
        <LocationSection
          branches={activeBranches}
        />
      </main>

      {/* Footer */}
      <Footer
        name={settings.nama_kos}
        whatsappUrl={whatsapp}
        instagramUrl={
          settings.instagram_url
        }
      />
    </>
  );
}