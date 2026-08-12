import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BranchForm from "@/components/admin/BranchForm";
import { adminServerGetById } from "@/lib/admin-server-api";
import type { Cabang } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCabang({
  params,
}: Props) {
  const { id } = await params;
  const branch = await adminServerGetById<Cabang>(
    "admin/cabang",
    Number(id),
  );

  if (!branch) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Cabang"
        title={`Edit ${branch.nama}`}
        description="Perbarui alamat, kontak, Maps, dan status cabang."
        backHref={`/admin/cabang/${branch.id}`}
      />
      <BranchForm branch={branch} />
    </div>
  );
}
