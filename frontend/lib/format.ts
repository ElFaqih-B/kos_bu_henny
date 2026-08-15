
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function rupiah(
  value: number | null | undefined,
): string {
  if (value == null || Number.isNaN(value)) {
    return "-";
  }

  return rupiahFormatter.format(value);
}
