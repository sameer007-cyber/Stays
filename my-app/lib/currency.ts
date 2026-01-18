export type Currency = "USD" | "INR" | "EUR"

export function formatPrice(
  amount: number,
  currency: Currency = "USD"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
