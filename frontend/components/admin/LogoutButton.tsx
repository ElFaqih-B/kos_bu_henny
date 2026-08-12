"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { apiPost } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      await apiPost("auth/logout");
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="
        flex min-h-10 w-full items-center gap-3 rounded-lg
        px-3 text-sm font-medium text-white/60 transition
        hover:bg-white/7 hover:text-white
      "
    >
      <LogOut size={17} />
      Keluar
    </button>
  );
}
