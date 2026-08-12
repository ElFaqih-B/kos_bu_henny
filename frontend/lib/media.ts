const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(
    /\/+$/,
    "",
  );

export function mediaUrl(
  path?: string | null,
): string | null {
  if (!path) {
    return null;
  }

  const value = path.trim();

  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const relativePath = value.startsWith("/")
    ? value
    : `/${value}`;

  if (!MEDIA_BASE_URL) {
    return relativePath;
  }

  return `${MEDIA_BASE_URL}${relativePath}`;
}
