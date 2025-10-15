export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

export function formatPercent(value: number, fractionDigits: number = 2): string {
  return `${value.toFixed(fractionDigits)}%`;
}
