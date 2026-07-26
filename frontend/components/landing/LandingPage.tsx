"use client";

import { useEffect, useMemo, useState } from "react";
import { imageUrl, publicApi, whatsappUrl } from "@/lib/api";
import type {
  Cabang,
  Dokumentasi,
  Fasilitas,
  Kamar,
  Konten,
  Pengaturan,
} from "@/lib/types";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import GallerySection from "./GallerySection";
import RoomSection from "./RoomSection";
// import FacilitySection from "./FacilitySection";
// import CtaSection from "./CtaSection";
import LocationSection from "./LocationSection";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  const [settings, setSettings] = useState<Pengaturan | null>(null);
  const [rooms, setRooms] = useState<Kamar[]>([]);
  const [branches, setBranches] = useState<Cabang[]>([]);
  const [facilities, setFacilities] = useState<Fasilitas[]>([]);
  const [docs, setDocs] = useState<Dokumentasi[]>([]);
  const [contents, setContents] = useState<Konten[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLandingPage() {
      try {
        const [settingsData, roomsData, branchesData, facilitiesData, docsData, contentsData] =
          await Promise.all([
            publicApi.pengaturan(),
            publicApi.kamar(),
            publicApi.cabang(),
            publicApi.fasilitas(),
            publicApi.dokumentasi(),
            publicApi.konten(),
          ]);

        setSettings(settingsData);
        setRooms(roomsData);
        setBranches(branchesData);
        // setFacilities(facilitiesData);
        setDocs(docsData);
        setContents(contentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil data website.");
      } finally {
        setLoading(false);
      }
    }

    loadLandingPage();
  }, []);

  const byKey = useMemo(
    () => Object.fromEntries(contents.map((item) => [item.kunci, item])) as Record<string, Konten>,
    [contents],
  );

  const activeRooms = useMemo(() => rooms.filter((room) => room.aktif !== false), [rooms]);
  const activeBranches = useMemo(
    () => branches.filter((branch) => branch.aktif !== false),
    [branches],
  );

  const stats = useMemo(
    () => ({
      roomTypes: activeRooms.length,
      availableRooms: activeRooms.reduce((total, room) => total + room.kamar_tersedia, 0),
      branches: activeBranches.length,
      startingPrice: activeRooms.length
        ? Math.min(...activeRooms.map((room) => room.harga_bulanan))
        : null,
    }),
    [activeRooms, activeBranches.length],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--cream)]">
        <div className="h-[66px] bg-[var(--ink)] md:h-[72px]" />
        <div className="h-[62vh] min-h-[520px] animate-pulse bg-[var(--ink-soft)]" />
        <div className="container-page py-14">
          <div className="h-[360px] animate-pulse rounded-[10px] bg-[var(--parchment)]" />
        </div>
      </main>
    );
  }

  if (error || !settings) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--cream)] p-5">
        <div className="max-w-md rounded-[10px] border border-[var(--danger-border)] bg-[var(--danger-bg)] p-6">
          <h1 className="text-2xl text-[var(--danger)]">Website belum dapat mengambil data.</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {error || "Data pengaturan website belum tersedia dari backend."}
          </p>
        </div>
      </main>
    );
  }

  const whatsapp = whatsappUrl(settings.nomor_whatsapp);
  const fallbackHero =
    activeRooms.find((room) => imageUrl(room.url_gambar))?.url_gambar ||
    docs.find((item) => imageUrl(item.path_foto))?.path_foto ||
    null;

  return (
    <main>
      <Navbar name={settings.nama_kos} whatsapp={whatsapp} />
      <HeroSection
        settings={settings}
        whatsapp={whatsapp}
        stats={stats}
        fallbackImage={fallbackHero}
      />
      <GallerySection items={docs} content={byKey.galeri} />
      <RoomSection
        rooms={activeRooms}
        branches={activeBranches}
        settings={settings}
        content={byKey.kamar}
      />
      {/* <FacilitySection facilities={facilities} content={byKey.mengapa} /> */}
      {/* <CtaSection settings={settings} whatsapp={whatsapp} /> */}
      <LocationSection branches={activeBranches} settings={settings} />
      <Footer settings={settings} whatsapp={whatsapp} />
    </main>
  );
}
