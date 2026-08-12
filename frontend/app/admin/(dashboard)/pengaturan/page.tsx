import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import { adminServerGet } from "@/lib/admin-server-api";
import type { Pengaturan } from "@/lib/types";

export default async function PengaturanPage() {
  const settings =
    await adminServerGet<Pengaturan>(
      "admin/pengaturan",
    );

  return (
    <div>
      <AdminPageHeader
        eyebrow="Pengaturan"
        title="Pengaturan website"
        description="Kelola identitas, hero, kontak, dan CTA website dari satu tempat."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
