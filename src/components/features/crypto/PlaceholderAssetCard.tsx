type PlaceholderAssetCardProps = {
  name?: string;
};

export function PlaceholderAssetCard({ name = "Bitcoin" }: PlaceholderAssetCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="text-base font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">$00,000.00 · 0.00%</div>
    </div>
  );
}
