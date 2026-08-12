import { notFound } from "next/navigation";
import { Edit3, Images } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminServerGetById } from "@/lib/admin-server-api";
import { mediaUrl } from "@/lib/media";
import type { Dokumentasi } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DokumentasiDetail({
  params,
}: Props) {
  const { id } = await params;
  const item = await adminServerGetById<Dokumentasi>(
    "admin/dokumentasi",
    Number(id),
  );

  if (!item) {
    notFound();
  }

  const image = mediaUrl(item.path_foto);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Dokumentasi"
        title={item.caption || "Dokumentasi"}
        description="Periksa media dan metadata sebelum mengubahnya."
        backHref="/admin/dokumentasi"
        action={
          <AdminButton
            href={`/admin/dokumentasi/${item.id}/edit`}
          >
            <Edit3 size={16} />
            Edit
          </AdminButton>
        }
      />

      <section className="max-w-3xl overflow-hidden rounded-xl border border-(--line) bg-white">
        <div className="aspect-video bg-(--cream)">
          {image ? (
            <img
              src={image}
              alt={item.teks_alt}
              className="size-full object-contain"
            />
          ) : (
            <div className="grid size-full place-items-center text-(--stone)">
              <Images size={36} />
            </div>
          )}
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
          <Info
            label="Caption"
            value={item.caption || "-"}
          />
          <Info
            label="Teks alternatif"
            value={item.teks_alt}
          />
          <Info
            label="Path"
            value={item.path_foto}
          />
          <Info
            label="Status"
            value={item.aktif ? "Aktif" : "Nonaktif"}
          />
        </div>
      </section>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[9px] bg-(--cream)/55 p-3">
      <p className="text-[9px] text-(--muted)">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-semibold leading-5">
        {value}
      </p>
    </div>
  );
}
