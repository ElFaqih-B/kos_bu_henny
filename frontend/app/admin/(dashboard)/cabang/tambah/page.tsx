import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BranchForm from "@/components/admin/BranchForm";

export default function TambahCabangPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Cabang"
        title="Tambah cabang"
        description="Tambahkan lokasi baru untuk dikelompokkan dengan kamar-kamar di website."
        backHref="/admin/cabang"
      />
      <BranchForm />
    </div>
  );
}
