
export function getBackendBaseUrl(): string {
  const value = process.env.BACKEND_INTERNAL_URL?.trim();

  if (!value) {
    throw new Error(
      "BACKEND_INTERNAL_URL belum dikonfigurasi.",
    );
  }

  return value.replace(/\/+$/, "");
}
