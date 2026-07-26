import { ArrowDownRight, MessageCircle } from "lucide-react";
import { imageUrl, rupiah } from "@/lib/api";
import type { Pengaturan } from "@/lib/types";

type HeroStats = {
  roomTypes: number;
  availableRooms: number;
  branches: number;
  startingPrice: number | null;
};

type HeroSectionProps = {
  settings: Pengaturan;
  whatsapp: string | null;
  stats: HeroStats;
  fallbackImage: string | null;
};

export default function HeroSection({
  settings,
  whatsapp,
  stats,
  fallbackImage,
}: HeroSectionProps) {
  const hero = imageUrl(settings.hero_image) || imageUrl(fallbackImage);

  const facts = [
    {
      label: "Harga mulai",
      value: stats.startingPrice !== null ? rupiah(stats.startingPrice) : "Belum tersedia",
    },
    {
      label: "Pilihan kamar",
      value: stats.roomTypes > 0 ? `${stats.roomTypes} tipe` : "Belum tersedia",
    },
    {
      label: "Kamar tersedia",
      value: stats.roomTypes > 0 ? `${stats.availableRooms} kamar` : "Belum tersedia",
    },
    {
      label: "Lokasi",
      value: stats.branches > 0 ? `${stats.branches} cabang` : "Belum tersedia",
    },
  ];

  return (
    <section
      id="beranda"
      className="relative mb-24 min-h-[560px] overflow-visible bg-[var(--ink)] text-white sm:min-h-[610px] md:min-h-[660px] lg:min-h-[690px]"
    >
      <div className="absolute inset-0 overflow-hidden">
        {hero ? (
          <div
            className="absolute inset-0 scale-[1.01] bg-cover bg-center"
            style={{ backgroundImage: `url("${hero}")` }}
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--ink-soft)]" aria-hidden="true" />
        )}

        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(50,45,41,.56)_0%,rgba(50,45,41,.38)_38%,rgba(50,45,41,.58)_72%,rgba(50,45,41,.84)_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="container-page relative z-10 flex min-h-[560px] items-start justify-center pb-28 pt-20 sm:min-h-[610px] sm:pt-24 md:min-h-[660px] md:pb-32 md:pt-28 lg:min-h-[690px] lg:pt-32">
        <div className="mx-auto w-full max-w-[900px] text-center">
          <h1 className="mx-auto max-w-[880px] text-balance text-[clamp(2.45rem,6vw,4.8rem)] leading-[1.02] tracking-[-0.035em] text-white">
            {settings.hero_headline}
          </h1>

          <p className="mx-auto mt-5 max-w-[650px] px-1 text-[14px] leading-6 text-white/84 sm:text-[15px] sm:leading-7 md:text-base">
            {settings.hero_subheadline}
          </p>

          <div className="mx-auto mt-7 flex max-w-full flex-wrap items-center justify-center gap-3 sm:mt-8">
            <a
              href="#kamar"
              className="btn-base btn-accent min-h-11 min-w-[160px] px-5 py-2.5 text-[13px] sm:min-h-12 sm:min-w-[178px] sm:text-sm"
            >
              <span className="whitespace-nowrap">{settings.hero_cta_primary}</span>
              <ArrowDownRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </a>

            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-base btn-light-outline min-h-11 min-w-[160px] px-5 py-2.5 text-[13px] sm:min-h-12 sm:min-w-[178px] sm:text-sm"
              >
                <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />
                <span className="whitespace-nowrap">{settings.hero_cta_secondary}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 translate-y-[44%] sm:translate-y-1/2">
        <div className="container-page">
          <div className="grid grid-cols-2 overflow-hidden rounded-[10px] border border-black/[0.08] bg-white shadow-[0_16px_40px_rgba(50,45,41,.14)] lg:grid-cols-4">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={`min-w-0 px-4 py-3.5 text-left sm:px-5 sm:py-4 md:px-6 md:py-5 ${
                  index % 2 !== 0 ? "border-l border-[var(--line)]" : ""
                } ${index > 1 ? "border-t border-[var(--line)] lg:border-t-0" : ""} ${
                  index > 0 ? "lg:border-l lg:border-[var(--line)]" : ""
                }`}
              >
                <span className="block text-[10px] font-medium leading-tight text-[var(--stone)] sm:text-[11px]">
                  {fact.label}
                </span>
                <strong className="mt-1.5 block truncate font-editorial text-[18px] font-normal leading-tight text-[var(--ink)] sm:text-[20px] md:text-[23px]">
                  {fact.value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
