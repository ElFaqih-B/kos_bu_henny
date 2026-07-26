import {
  Bath,
  CarFront,
  Cctv,
  CircleCheck,
  CookingPot,
  DoorOpen,
  LampDesk,
  ShieldCheck,
  Shirt,
  Wifi,
} from "lucide-react";
import type { Fasilitas, Konten } from "@/lib/types";

const icons = {
  Wifi,
  ShieldCheck,
  CarFront,
  Bath,
  CookingPot,
  DoorOpen,
  LampDesk,
  Shirt,
  Cctv,
  CircleCheck,
};

export default function FacilitySection({
  facilities,
  content,
}: {
  facilities: Fasilitas[];
  content?: Konten;
}) {
  const visibleFacilities = facilities.filter((facility) => facility.aktif !== false);
  if (!visibleFacilities.length) return null;

  return (
    <section id="fasilitas" className="bg-[var(--parchment)] py-16 md:py-24 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
        <div className="max-w-xl">
          <h2 className="section-title">{content?.judul || "Fasilitas"}</h2>
          {content?.isi && (
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-[var(--text-secondary)]">{content.isi}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--line)]">
          {visibleFacilities.map((facility) => {
            const Icon = icons[(facility.ikon || "CircleCheck") as keyof typeof icons] || CircleCheck;

            return (
              <article key={facility.id} className="min-w-0 bg-[var(--cream)] p-4 sm:p-5">
                <span className="grid size-10 place-items-center rounded-[8px] bg-white text-[var(--accent)]">
                  <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                </span>

                <h3 className="mt-3 font-editorial text-[17px] leading-tight text-[var(--ink)] sm:text-[19px]">
                  {facility.nama}
                </h3>

                {facility.deskripsi && (
                  <p className="mt-2 hidden text-sm leading-6 text-[var(--stone)] sm:block">
                    {facility.deskripsi}
                  </p>
                )}

                {facility.kategori && (
                  <span className="mt-2 block text-[11px] font-medium text-[var(--accent)]">
                    {facility.kategori}
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
