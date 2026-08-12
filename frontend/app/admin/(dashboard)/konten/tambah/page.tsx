import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ContentForm from "@/components/admin/ContentForm";

export default function TambahKonten() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Konten"
        title="Tambah konten"
        description="Buat blok konten baru untuk digunakan oleh website."
        backHref="/admin/konten"
      />
      <ContentForm />
    </div>
  );
}
