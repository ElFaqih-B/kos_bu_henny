export function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappUrl(number?: string | null) {
  if (!number) return null;

  return `https://wa.me/${number}`;
}