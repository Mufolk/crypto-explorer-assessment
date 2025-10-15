export function formatCurrency(value: number | null | undefined, currency: string = "USD"): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '--';
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

export function formatPercent(value: number | null | undefined, fractionDigits: number = 2): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '--%';
  }
  return `${value.toFixed(fractionDigits)}%`;
}
