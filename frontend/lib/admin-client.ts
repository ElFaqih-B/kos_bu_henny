"use client";

type RequestOptions = RequestInit & {
  json?: unknown;
};

async function adminClientRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const cleanPath = path.replace(/^\/+/, "");
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.json !== undefined) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  const response = await fetch(
    `/admin/api/v1/${cleanPath}`,
    {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
      body:
        options.json !== undefined
          ? JSON.stringify(options.json)
          : options.body,
    },
  );

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : typeof data?.message === "string"
          ? data.message
          : `Request gagal dengan status ${response.status}.`;

    throw new Error(message);
  }

  return data as T;
}

export function adminClientGet<T>(
  path: string,
): Promise<T> {
  return adminClientRequest<T>(path, {
    method: "GET",
  });
}

export function adminClientPost<T>(
  path: string,
  json?: unknown,
): Promise<T> {
  return adminClientRequest<T>(path, {
    method: "POST",
    json,
  });
}

export function adminClientPatch<T>(
  path: string,
  json?: unknown,
): Promise<T> {
  return adminClientRequest<T>(path, {
    method: "PATCH",
    json,
  });
}

export function adminClientDelete<T = void>(
  path: string,
): Promise<T> {
  return adminClientRequest<T>(path, {
    method: "DELETE",
  });
}

export function adminClientUpload<T>(
  path: string,
  file: File,
): Promise<T> {
  const formData = new FormData();

  formData.append("file", file);

  return adminClientRequest<T>(path, {
    method: "POST",
    body: formData,
  });
}