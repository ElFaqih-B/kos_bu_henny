const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  "http://localhost:8000";

type ServerRequestOptions = RequestInit & {
  json?: unknown;
};

export async function serverRequest<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T> {
  const url =
    `${BACKEND_URL.replace(/\/$/, "")}` +
    `/api/v1/${path.replace(/^\/+/, "")}`;

  const headers = new Headers(options.headers);

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
      `API error ${response.status}: ${path}`;

    try {
      const data = await response.json();

      if (typeof data?.detail === "string") {
        message = data.detail;
      }
    } catch {
      // Ignore invalid JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const serverGet = <T>(
  path: string,
) =>
  serverRequest<T>(path, {
    method: "GET",
  });

export const serverPost = <T>(
  path: string,
  json?: unknown,
) =>
  serverRequest<T>(path, {
    method: "POST",
    json,
  });

export const serverPatch = <T>(
  path: string,
  json?: unknown,
) =>
  serverRequest<T>(path, {
    method: "PATCH",
    json,
  });

export const serverDelete = <T = void>(
  path: string,
) =>
  serverRequest<T>(path, {
    method: "DELETE",
  });