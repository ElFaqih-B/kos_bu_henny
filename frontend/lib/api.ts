const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

type ApiRequestOptions = RequestInit & {
  json?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const url = `${API_URL}/${path.replace(/^\/+/, "")}`;
  const headers = new Headers(options.headers);

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
    body:
      options.json !== undefined
        ? JSON.stringify(options.json)
        : options.body,
  });

  if (!response.ok) {
    let message = `API error: ${response.status}`;

    try {
      const data = await response.json();
      if (typeof data?.detail === "string") {
        message = data.detail;
      }
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiGet = <T>(path: string) =>
  apiRequest<T>(path, { method: "GET" });

export const apiPost = <T>(path: string, json?: unknown) =>
  apiRequest<T>(path, { method: "POST", json });

export const apiPatch = <T>(path: string, json?: unknown) =>
  apiRequest<T>(path, { method: "PATCH", json });

export const apiDelete = <T = void>(path: string) =>
  apiRequest<T>(path, { method: "DELETE" });
