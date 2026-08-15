
import { rupiah } from "@/lib/format";
import type { Kamar } from "@/lib/types";

export function normalizeWhatsapp(
  value?: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const cleaned = value.replace(/\D/g, "");

  if (!cleaned) {
    return null;
  }

  if (cleaned.startsWith("0")) {
    return `62${cleaned.slice(1)}`;
  }

  if (cleaned.startsWith("62")) {
    return cleaned;
  }

  return `62${cleaned}`;
}

export function whatsappUrl(
  number?: string | null,
): string | null {
  const normalized = normalizeWhatsapp(number);

  return normalized
    ? `https://wa.me/${normalized}`
    : null;
}

export function buildRoomWhatsappUrl(
  room: Kamar,
  whatsappNumber?: string | null,
): string | null {
  const phone = normalizeWhatsapp(whatsappNumber);

  if (!phone) {
    return null;
  }

  const branch =
    room.cabang?.nama ?? "Kos Omah Subardiman";

  const message = [
    "Halo Bapak/Ibu,",
    "",
    `Saya tertarik dengan ${room.nama} di ${branch}.`,
    `Harga: ${rupiah(room.harga_bulanan)}/${room.periode_harga}.`,
    "",
    "Apakah kamar ini masih tersedia?",
  ].join("\n");

  return (
    `https://wa.me/${phone}?text=` +
    encodeURIComponent(message)
  );
}
