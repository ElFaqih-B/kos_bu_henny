
import { getBackendBaseUrl } from "@/lib/backend-url";

type ServerRequestOptions = RequestInit & {
  json?: unknown;
};

export async function serverRequest<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T> {
  const cleanPath = path.replace(/^\/+/, "");
  const url = `${getBackendBaseUrl()}/api/v1/${cleanPath}`;
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
    body:
      options.json !== undefined
        ? JSON.stringify(options.json)
        : options.body,
  });

  if (!response.ok) {
    let message =
      `API error ${response.status}: ${cleanPath}`;

    try {
      const data = await response.json();

      if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (typeof data?.message === "string") {
        message = data.message;
      }
    } catch {
      // Gunakan pesan status jika response bukan JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function serverGet<T>(
  path: string,
): Promise<T> {
  return serverRequest<T>(path, {
    method: "GET",
  });
}
