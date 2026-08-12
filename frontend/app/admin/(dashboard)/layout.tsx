import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { getServerAdmin } from "@/lib/admin-auth";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getServerAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-(--page) text-(--ink)">
      <AdminSidebar username={admin.username} />

      <div className="min-h-screen lg:ml-[213px]">
        <div className="border-b border-(--line) bg-(--page)">
          <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-7">
            <AdminTopbar
              username={admin.username}
            />
          </div>
        </div>

        <main className="mx-auto w-full max-w-[1180px] px-4 py-5 sm:px-6 sm:py-7 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  );
}
