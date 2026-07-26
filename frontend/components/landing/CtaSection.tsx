import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Pengaturan } from "@/lib/types";

export default function CtaSection({
  settings,
  whatsapp,
}: {
  settings: Pengaturan;
  whatsapp: string | null;
}) {
  if (!settings.cta_heading && !settings.cta_description) return null;

  return (
    <section className="bg-[var(--cream)] py-16 md:py-20 lg:py-24">
      <div className="container-page">
        <div className="overflow-hidden rounded-[10px] bg-[var(--accent)] px-6 py-10 text-white sm:px-9 md:px-12 md:py-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <h2 className="section-title text-white">{settings.cta_heading}</h2>
              {settings.cta_description && (
                <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/78">
                  {settings.cta_description}
                </p>
              )}
            </div>

            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-base min-h-12 w-full border border-white bg-white px-6 text-sm text-[var(--accent)] transition-colors hover:bg-[var(--cream)] md:w-auto"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Cek ketersediaan
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
