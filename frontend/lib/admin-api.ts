import { getAdminToken } from "@/lib/admin-auth";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL || "http://localhost:8000";

const ADMIN_COOKIE = "kos_omah_subardiman_admin";

function getBackendUrl(path: string) {
  const base = BACKEND_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${normalizedPath}`;
}

export async function adminApiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAdminToken();

  if (!token) {
    throw new Error("Admin belum login.");
  }

  const url = getBackendUrl(path);

  const headers = new Headers(options.headers);

  headers.set(
    "Cookie",
    `${ADMIN_COOKIE}=${encodeURIComponent(token)}`,
  );

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request gagal dengan status ${response.status}.`;

    try {
      const data = await response.json();

      if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (typeof data?.message === "string") {
        message = data.message;
      }
    } catch {
      // Response bukan JSON, gunakan pesan default.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function adminGet<T>(path: string) {
  return adminApiRequest<T>(path, {
    method: "GET",
  });
}

export function adminPost<T>(
  path: string,
  body?: unknown,
) {
  return adminApiRequest<T>(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function adminPut<T>(
  path: string,
  body?: unknown,
) {
  return adminApiRequest<T>(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function adminDelete<T>(path: string) {
  return adminApiRequest<T>(path, {
    method: "DELETE",
  });
}