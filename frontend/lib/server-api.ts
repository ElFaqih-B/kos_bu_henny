const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL || "http://localhost:8000";

export async function serverGet<T>(path: string): Promise<T> {
  const response = await fetch(
    `${BACKEND_URL}/api/v1/${path.replace(/^\/+/, "")}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${path}`);
  }

  return response.json();
}