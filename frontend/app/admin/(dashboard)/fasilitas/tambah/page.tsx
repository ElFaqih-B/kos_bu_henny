import AdminPageHeader from "@/components/admin/AdminPageHeader";
import FacilityForm from "@/components/admin/FacilityForm";

export default function TambahFasilitas() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Fasilitas"
        title="Tambah fasilitas"
        description="Buat fasilitas baru untuk digunakan pada data kamar."
        backHref="/admin/fasilitas"
      />
      <FacilityForm />
    </div>
  );
}
