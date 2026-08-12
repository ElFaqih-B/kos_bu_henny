import { getAdminToken } from "@/lib/admin-auth";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  "http://localhost:8000";

const ADMIN_COOKIE =
  "kos_omah_subardiman_admin";

type AdminRequestOptions = RequestInit & {
  json?: unknown;
};

function buildUrl(path: string): string {
  const base = BACKEND_URL.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");

  return `${base}/api/v1/${cleanPath}`;
}

async function parseError(
  response: Response,
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item: unknown) => {
          if (
            typeof item === "object" &&
            item !== null &&
            "msg" in item
          ) {
            return String(
              (item as { msg?: unknown }).msg ?? "",
            );
          }

          return String(item);
        })
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    // Gunakan pesan status jika response bukan JSON.
  }

  return `Request gagal dengan status ${response.status}.`;
}

export async function adminServerRequest<T>(
  path: string,
  options: AdminRequestOptions = {},
): Promise<T> {
  const token = await getAdminToken();

  if (!token) {
    throw new Error(
      "Cookie autentikasi admin tidak ditemukan.",
    );
  }

  const headers = new Headers(options.headers);

  headers.set(
    "Cookie",
    `${ADMIN_COOKIE}=${token}`,
  );
  headers.set("Accept", "application/json");

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
    buildUrl(path),
    {
      ...options,
      headers,
      body:
        options.json !== undefined
          ? JSON.stringify(options.json)
          : options.body,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const message = await parseError(response);

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      throw new Error(
        `Sesi admin tidak valid atau sudah berakhir. ${message}`,
      );
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function adminServerGet<T>(
  path: string,
): Promise<T> {
  return adminServerRequest<T>(path, {
    method: "GET",
  });
}

export function adminServerPost<T>(
  path: string,
  json?: unknown,
): Promise<T> {
  return adminServerRequest<T>(path, {
    method: "POST",
    json,
  });
}

export function adminServerPatch<T>(
  path: string,
  json?: unknown,
): Promise<T> {
  return adminServerRequest<T>(path, {
    method: "PATCH",
    json,
  });
}

export function adminServerDelete<T = void>(
  path: string,
): Promise<T> {
  return adminServerRequest<T>(path, {
    method: "DELETE",
  });
}

/**
 * The backend currently exposes collection GET endpoints for admin data,
 * but not GET /resource/{id}. Resolve one record from its collection.
 */
export async function adminServerGetById<
  T extends { id: number },
>(
  collectionPath: string,
  id: number,
): Promise<T | null> {
  const items = await adminServerGet<T[]>(
    collectionPath,
  );

  return (
    items.find((item) => item.id === id) ?? null
  );
}
