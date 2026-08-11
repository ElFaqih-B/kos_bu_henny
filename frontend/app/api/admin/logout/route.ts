import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

const ADMIN_COOKIE =
  "kos_omah_subardiman_admin";

export async function POST() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;

  if (token) {
    try {
      await fetch(
        `${BACKEND_URL.replace(/\/$/, "")}/api/v1/auth/logout`,
        {
          method: "POST",
          headers: {
            Cookie: `${ADMIN_COOKIE}=${token}`,
          },
          cache: "no-store",
        },
      );
    } catch {
      // Tetap hapus cookie lokal.
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