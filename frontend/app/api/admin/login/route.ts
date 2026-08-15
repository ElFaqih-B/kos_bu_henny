
import { NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/backend-url";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

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
      `${getBackendBaseUrl()}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
      new RegExp(`${ADMIN_COOKIE}=([^;]+)`),
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

    const nextResponse = NextResponse.json(
      data ?? { username },
      { status: 200 },
    );

    nextResponse.cookies.set({
      name: ADMIN_COOKIE,
      value: tokenMatch[1],
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
        detail:
          error instanceof Error &&
          error.message.includes(
            "BACKEND_INTERNAL_URL",
          )
            ? error.message
            : "Tidak dapat terhubung ke backend.",
      },
      { status: 502 },
    );
  }
}
