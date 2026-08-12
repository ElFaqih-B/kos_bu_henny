import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DocumentationForm from "@/components/admin/DocumentationForm";
import { adminServerGet } from "@/lib/admin-server-api";
import type { Cabang } from "@/lib/types";

export default async function TambahDokumentasi() {
  const branches = await adminServerGet<Cabang[]>(
    "admin/cabang",
  );

  return (
    <div>
      <AdminPageHeader
        eyebrow="Dokumentasi"
        title="Tambah dokumentasi"
        description="Tambahkan path atau URL foto yang sudah tersedia pada media backend."
        backHref="/admin/dokumentasi"
      />
      <DocumentationForm
        branches={branches}
      />
    </div>
  );
}
