import { notFound } from "next/navigation";
import { Edit3, Sparkles } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminServerGetById } from "@/lib/admin-server-api";
import type { Fasilitas } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FasilitasDetail({
  params,
}: Props) {
  const { id } = await params;
  const facility =
    await adminServerGetById<Fasilitas>(
      "admin/fasilitas",
      Number(id),
    );

  if (!facility) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Detail fasilitas"
        title={facility.nama}
        description="Periksa informasi fasilitas yang tersimpan pada sistem."
        backHref="/admin/fasilitas"
        action={
          <AdminButton
            href={`/admin/fasilitas/${facility.id}/edit`}
          >
            <Edit3 size={16} />
            Edit fasilitas
          </AdminButton>
        }
      />

      <section className="max-w-2xl rounded-xl border border-(--line) bg-white p-5 sm:p-6">
        <div className="grid size-12 place-items-center rounded-[10px] bg-(--cream) text-(--accent)">
          <Sparkles size={20} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-(--cream) px-2.5 py-1 text-[10px] font-bold text-(--accent)">
            {facility.kategori}
          </span>
          <span
            className={
              facility.aktif
                ? "rounded-full bg-[#e9f2ec] px-2.5 py-1 text-[10px] font-bold text-[#47775f]"
                : "rounded-full bg-[#f6e8e9] px-2.5 py-1 text-[10px] font-bold text-[#a44d55]"
            }
          >
            {facility.aktif
              ? "Aktif"
              : "Nonaktif"}
          </span>
        </div>

        <p className="mt-5 text-sm leading-7 text-(--stone)">
          {facility.deskripsi ||
            "Belum ada deskripsi."}
        </p>
      </section>
    </div>
  );
}
