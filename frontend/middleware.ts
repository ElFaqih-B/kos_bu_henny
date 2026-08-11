import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "kos_omah_subardiman_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";

  const isAdminPage =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const hasToken = request.cookies.has(ADMIN_COOKIE);

  // Belum login → halaman admin tidak boleh diakses.
  if (isAdminPage && !isLoginPage && !hasToken) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
  }

  // Sudah login → jangan kembali ke halaman login.
  if (isLoginPage && hasToken) {
    return NextResponse.redirect(
      new URL("/admin", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};