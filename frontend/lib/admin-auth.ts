import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL;

export const ADMIN_COOKIE = "kos_omah_subardiman_admin";

export type AdminSession = {
  id: number;
  username: string;
  aktif: boolean;
};

export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();

  return store.get(ADMIN_COOKIE)?.value ?? null;
}

export async function getServerAdmin(): Promise<AdminSession | null> {
  const token = await getAdminToken();

  if (!token || !BACKEND_URL) {
    return null;
  }

  try {
    const response = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/api/v1/auth/me`,
      {
        method: "GET",
        headers: {
          Cookie: `${ADMIN_COOKIE}=${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AdminSession;
  } catch {
    return null;
  }
}