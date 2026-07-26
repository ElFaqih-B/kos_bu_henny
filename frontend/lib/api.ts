import type {
  Cabang,
  Dokumentasi,
  Fasilitas,
  Kamar,
  Konten,
  Pengaturan,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:8000/api/v1";

const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ??
  "http://127.0.0.1:8000";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    let message = `Request gagal (${response.status})`;

    try {
      const data = await response.json();

      if (data?.detail) {
        message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);
      }
    } catch {
      // Response bukan JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const publicApi = {
  pengaturan() {
    return request<Pengaturan>("/pengaturan");
  },

  kamar() {
    return request<Kamar[]>("/kamar");
  },

  cabang() {
    return request<Cabang[]>("/cabang");
  },

  fasilitas() {
    return request<Fasilitas[]>("/fasilitas");
  },

  dokumentasi() {
    return request<Dokumentasi[]>("/dokumentasi");
  },

  konten() {
    return request<Konten[]>("/konten");
  },
};

export function imageUrl(
  path: string | null | undefined,
): string | null {
  if (!path) {
    return null;
  }

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

export function rupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappUrl(
  number: string | null | undefined,
  message?: string,
): string | null {
  if (!number) {
    return null;
  }

  const normalizedNumber = number.replace(/\D/g, "");

  const internationalNumber =
    normalizedNumber.startsWith("0")
      ? `62${normalizedNumber.slice(1)}`
      : normalizedNumber;

  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : "";

  return `https://wa.me/${internationalNumber}${text}`;
}