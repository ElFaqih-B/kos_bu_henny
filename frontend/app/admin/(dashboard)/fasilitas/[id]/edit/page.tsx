import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import FacilityForm from "@/components/admin/FacilityForm";
import { adminServerGetById } from "@/lib/admin-server-api";
import type { Fasilitas } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditFasilitas({
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
        eyebrow="Fasilitas"
        title={`Edit ${facility.nama}`}
        description="Perbarui nama, kategori, deskripsi, dan status fasilitas."
        backHref={`/admin/fasilitas/${facility.id}`}
      />
      <FacilityForm facility={facility} />
    </div>
  );
}
