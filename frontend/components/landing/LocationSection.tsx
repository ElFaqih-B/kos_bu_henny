"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Cabang, Pengaturan } from "@/lib/types";

function shortBranchName(name: string) {
  return (
    name
      .replace(/^Kos Bu Henny\s*-?\s*/i, "")
      .replace(/^Cabang\s+/i, "")
      .trim() || name
  );
}

export default function LocationSection({
  branches,
  settings,
}: {
  branches: Cabang[];
  settings: Pengaturan;
}) {
  const activeBranches = useMemo(
    () => branches.filter((branch) => branch.aktif !== false).sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0)),
    [branches],
  );

  const [activeId, setActiveId] = useState<number | null>(activeBranches[0]?.id ?? null);

  useEffect(() => {
    if (!activeBranches.length) return;
    if (!activeBranches.some((branch) => branch.id === activeId)) {
      setActiveId(activeBranches[0].id);
    }
  }, [activeBranches, activeId]);

  const activeBranch = activeBranches.find((branch) => branch.id === activeId) || activeBranches[0] || null;
  const fallbackAddress = settings.alamat?.trim() || null;

  if (!activeBranch && !fallbackAddress) return null;

  const address = activeBranch?.alamat || fallbackAddress || "";
  const mapEmbedUrl = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : null;
  const externalMapUrl = activeBranch?.url_maps || settings.google_maps_url;

  return (
    <section id="lokasi" className="bg-[var(--cream)] py-16 md:py-24 lg:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="section-title">Lokasi Kos Bu Henny</h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--stone)]">
            Pilih cabang untuk melihat alamat dan peta lokasi.
          </p>
        </div>

        {activeBranches.length > 0 && (
          <div
            className="mobile-rail mt-7 flex gap-2 overflow-x-auto pb-2"
            role="tablist"
            aria-label="Pilih cabang"
          >
            {activeBranches.map((branch) => {
              const active = branch.id === activeBranch?.id;

              return (
                <button
                  key={branch.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveId(branch.id)}
                  className={`min-h-11 shrink-0 rounded-[8px] border px-4 text-sm font-semibold transition-colors ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--line-strong)] bg-white text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }`}
                >
                  {shortBranchName(branch.nama)}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-[10px] border border-[var(--line)] bg-white">
          <div className="grid lg:grid-cols-[1.35fr_.65fr]">
            <div className="min-h-[300px] bg-[var(--parchment)] sm:min-h-[360px] lg:min-h-[430px]">
              {mapEmbedUrl ? (
                <iframe
                  key={mapEmbedUrl}
                  src={mapEmbedUrl}
                  title={`Peta ${activeBranch?.nama || settings.nama_kos}`}
                  className="h-full min-h-[300px] w-full border-0 sm:min-h-[360px] lg:min-h-[430px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="grid h-full min-h-[300px] place-items-center p-6 text-center text-sm text-[var(--stone)]">
                  Peta belum tersedia.
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between p-5 sm:p-6 lg:p-8">
              <div>
                <span className="grid size-11 place-items-center rounded-[8px] bg-[var(--cream)] text-[var(--accent)]">
                  <MapPin size={19} aria-hidden="true" />
                </span>

                <h3 className="mt-5 text-[24px] leading-tight">
                  {activeBranch?.nama || settings.nama_kos}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[var(--stone)]">{address}</p>

                {activeBranch?.patokan && (
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    <strong className="font-semibold text-[var(--ink)]">Patokan:</strong>{" "}
                    {activeBranch.patokan}
                  </p>
                )}
              </div>

              {externalMapUrl && (
                <a
                  href={externalMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-base btn-outline mt-6 min-h-11 w-full px-5 text-sm"
                >
                  Buka di Google Maps
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
