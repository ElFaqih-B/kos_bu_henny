import { notFound } from "next/navigation";
import { Edit3, FileText } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminServerGetById } from "@/lib/admin-server-api";
import type { KontenHalaman } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KontenDetail({
  params,
}: Props) {
  const { id } = await params;
  const content =
    await adminServerGetById<KontenHalaman>(
      "admin/konten",
      Number(id),
    );

  if (!content) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Konten"
        title={content.judul || content.kunci}
        description="Periksa isi konten yang tersimpan pada sistem."
        backHref="/admin/konten"
        action={
          <AdminButton
            href={`/admin/konten/${content.id}/edit`}
          >
            <Edit3 size={16} />
            Edit
          </AdminButton>
        }
      />

      <section className="max-w-3xl rounded-xl border border-(--line) bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[9px] bg-(--cream) text-(--accent)">
            <FileText size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] text-(--muted)">
              Kunci
            </p>
            <p className="break-all text-sm font-semibold">
              {content.kunci}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-(--line) pt-5">
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            {content.judul || "Tanpa judul"}
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-(--stone)">
            {content.isi || "Belum ada isi."}
          </p>
        </div>
      </section>
    </div>
  );
}
