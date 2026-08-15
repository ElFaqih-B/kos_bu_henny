
import { cookies } from "next/headers";

import { getBackendBaseUrl } from "@/lib/backend-url";

export const ADMIN_COOKIE =
  "kos_omah_subardiman_admin";

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

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${getBackendBaseUrl()}/api/v1/auth/me`,
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
