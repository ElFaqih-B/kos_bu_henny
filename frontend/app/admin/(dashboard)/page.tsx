import {
  Building2,
  Camera,
  House,
  Layers3,
} from "lucide-react";

import { redirect } from "next/navigation";

import {
  getAdminToken,
  getServerAdmin,
} from "@/lib/admin-auth";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

type Summary = {
  jumlah_tipe_kamar: number;
  jumlah_kamar_tersedia: number;
  jumlah_dokumentasi: number;
  jumlah_fasilitas: number;
  konten_terakhir_diperbarui:
    | string
    | null;
};

async function getSummary(): Promise<Summary> {
  const admin =
    await getServerAdmin();

  const token =
    await getAdminToken();

  if (!admin || !token) {
    redirect("/admin/login");
  }

  const response = await fetch(
    `${BACKEND_URL.replace(/\/$/, "")}/api/v1/admin/ringkasan`,
    {
      headers: {
        Cookie: `kos_omah_subardiman_admin=${token}`,
      },
      cache: "no-store",
    },
  );

  if (response.status === 401) {
    redirect("/admin/login");
  }

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil ringkasan: ${response.status}`,
    );
  }

  return response.json();
}

export default async function AdminDashboardPage() {
  const summary =
    await getSummary();

  const cards = [
    [
      "Tipe kamar",
      summary.jumlah_tipe_kamar,
      House,
    ],
    [
      "Kamar tersedia",
      summary.jumlah_kamar_tersedia,
      Layers3,
    ],
    [
      "Fasilitas",
      summary.jumlah_fasilitas,
      Building2,
    ],
    [
      "Dokumentasi",
      summary.jumlah_dokumentasi,
      Camera,
    ],
  ] as const;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--accent)">
          Ringkasan
        </p>

        <h1 className="mt-2 font-(family-name:--font-fraunces) text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--stone)">
          Pantau data utama Kos Omah
          Subardiman dan kelola informasi
          website dari satu tempat.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ([label, value, Icon]) => (
            <section
              key={label}
              className="rounded-[10px] border border-(--line) bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-(--stone)">
                    {label}
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {value}
                  </p>
                </div>

                <div className="grid size-10 place-items-center rounded-lg bg-(--cream) text-(--accent)">
                  <Icon size={19} />
                </div>
              </div>
            </section>
          ),
        )}
      </div>

      <section className="mt-6 rounded-[10px] border border-(--line) bg-white p-5 sm:p-6">
        <h2 className="font-semibold">
          Status sistem
        </h2>

        <p className="mt-1 text-sm text-(--stone)">
          Autentikasi admin aktif dan
          dashboard berhasil terhubung ke
          backend.
        </p>
      </section>
    </div>
  );
}