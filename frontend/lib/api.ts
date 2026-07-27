const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_URL}/${path.replace(/^\/+/, "")}`;

  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}