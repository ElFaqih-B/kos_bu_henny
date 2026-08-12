import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ContentForm from "@/components/admin/ContentForm";
import { adminServerGetById } from "@/lib/admin-server-api";
import type { KontenHalaman } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditKonten({
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
        title={`Edit ${content.judul || content.kunci}`}
        description="Perbarui teks dan status konten website."
        backHref={`/admin/konten/${content.id}`}
      />
      <ContentForm content={content} />
    </div>
  );
}
