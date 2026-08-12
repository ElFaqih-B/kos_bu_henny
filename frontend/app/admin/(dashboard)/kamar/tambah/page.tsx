import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RoomForm from "@/components/admin/RoomForm";
import { adminServerGet } from "@/lib/admin-server-api";
import type { Cabang } from "@/lib/types";

export default async function TambahKamarPage() {
  const branches = await adminServerGet<Cabang[]>(
    "admin/cabang",
  );

  return (
    <div>
      <AdminPageHeader
        eyebrow="Kamar"
        title="Tambah kamar"
        description="Masukkan data kamar baru yang akan dikelola melalui panel admin."
        backHref="/admin/kamar"
      />
      <RoomForm branches={branches} />
    </div>
  );
}
