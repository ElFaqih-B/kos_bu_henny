import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

const ADMIN_COOKIE =
  "kos_omah_subardiman_admin";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;

    const username = body.username?.trim();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        {
          detail: "Username dan password wajib diisi.",
        },
        { status: 422 },
      );
    }

    const response = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
        cache: "no-store",
      },
    );

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? {
          detail: "Username atau password salah.",
        },
        {
          status: response.status,
        },
      );
    }

    /*
     * Backend FastAPI membuat cookie.
     * Kita tidak meneruskan Set-Cookie backend secara mentah,
     * karena cookie tersebut berasal dari domain backend.
     *
     * Ambil token dari Set-Cookie lalu pasang ulang
     * sebagai cookie pada domain frontend Next.js.
     */

    const setCookie = response.headers.get("set-cookie");

    if (!setCookie) {
      return NextResponse.json(
        {
          detail:
            "Login berhasil, tetapi token autentikasi tidak diterima dari backend.",
        },
        { status: 502 },
      );
    }

    const tokenMatch = setCookie.match(
      new RegExp(
        `${ADMIN_COOKIE}=([^;]+)`,
      ),
    );

    if (!tokenMatch) {
      return NextResponse.json(
        {
          detail:
            "Cookie autentikasi backend tidak ditemukan.",
        },
        { status: 502 },
      );
    }

    const token = tokenMatch[1];

    const nextResponse = NextResponse.json(
      data ?? {
        username,
      },
      { status: 200 },
    );

    nextResponse.cookies.set({
      name: ADMIN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return nextResponse;
  } catch (error) {
    console.error("Admin login proxy error:", error);

    return NextResponse.json(
      {
        detail: "Tidak dapat terhubung ke backend.",
      },
      { status: 502 },
    );
  }
}