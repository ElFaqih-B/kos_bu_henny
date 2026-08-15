
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/backend-url";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;

  if (token) {
    try {
      await fetch(
        `${getBackendBaseUrl()}/api/v1/auth/logout`,
        {
          method: "POST",
          headers: {
            Cookie: `${ADMIN_COOKIE}=${token}`,
          },
          cache: "no-store",
        },
      );
    } catch {
      // Cookie lokal tetap dihapus walaupun backend tidak tersedia.
    }
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
