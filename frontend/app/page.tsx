import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection"; 


export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
         <HeroSection
          headline="Kamar yang nyaman, tanpa proses cari kos yang ribet."
          subheadline="Lihat pilihan kamar, fasilitas, dan lokasi Kos Bu Henny. Kalau sudah menemukan yang cocok, tanyakan ketersediaannya langsung."
          heroImageUrl="/images/hero.avif"
          primaryCtaText="Lihat Pilihan Kamar"
          secondaryCtaText="Tanya via WhatsApp"
          whatsappUrl={null}

          startingPrice="Rp 850.000"
          roomTypes={3}
          availableRooms={7}
          branches={3}
        />
      </main>
    </>
  );
}