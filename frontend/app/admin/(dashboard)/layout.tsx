import type { ReactNode } from "react";

import {
  getServerAdmin,
} from "@/lib/admin-auth";

import { redirect } from "next/navigation";

type AdminDashboardLayoutProps = {
  children: ReactNode;
};

export default async function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const admin =
    await getServerAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-(--cream) text-(--ink)">
      <header className="border-b border-(--line) bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--accent)">
              Kos Omah Subardiman
            </p>

            <p className="mt-0.5 text-sm font-medium">
              Admin
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-(--stone)">
              Masuk sebagai
            </p>

            <p className="text-sm font-semibold">
              {admin.username}
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}