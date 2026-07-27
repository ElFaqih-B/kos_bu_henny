export function mediaUrl(path?: string | null) {
  if (!path) return null;

  // URL eksternal
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  // URL backend melalui Next.js proxy
  return path.startsWith("/")
    ? path
    : `/${path}`;
}