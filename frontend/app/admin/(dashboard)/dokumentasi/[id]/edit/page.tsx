import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DocumentationForm from "@/components/admin/DocumentationForm";
import {
  adminServerGet,
  adminServerGetById,
} from "@/lib/admin-server-api";
import type {
  Cabang,
  Dokumentasi,
} from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditDokumentasi({
  params,
}: Props) {
  const { id } = await params;

  const [item, branches] = await Promise.all([
    adminServerGetById<Dokumentasi>(
      "admin/dokumentasi",
      Number(id),
    ),
    adminServerGet<Cabang[]>("admin/cabang"),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Dokumentasi"
        title="Edit dokumentasi"
        description="Perbarui media, caption, teks alternatif, dan status publikasi."
        backHref={`/admin/dokumentasi/${item.id}`}
      />
      <DocumentationForm
        item={item}
        branches={branches}
      />
    </div>
  );
}
