export function rupiah(
  value: number | null | undefined,
): string {
  if (value == null) {
    return "-";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappUrl(
  number?: string | null,
): string | null {
  if (!number) {
    return null;
  }

  const cleaned = number.replace(/\D/g, "");

  if (!cleaned) {
    return null;
  }

  const normalized = cleaned.startsWith("0")
    ? `62${cleaned.slice(1)}`
    : cleaned.startsWith("62")
      ? cleaned
      : `62${cleaned}`;

  return `https://wa.me/${normalized}`;
}