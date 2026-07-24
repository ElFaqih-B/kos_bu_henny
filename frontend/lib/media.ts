import { MEDIA_BASE_URL } from "./config";


export function getMediaUrl(
  path: string | null | undefined,
): string | null {
  if (!path) {
    return null;
  }

  // Sudah berupa URL penuh.
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${MEDIA_BASE_URL}${normalizedPath}`;
}