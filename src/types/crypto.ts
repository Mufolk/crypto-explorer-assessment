export interface Asset {
  id: string;
  symbol: string;
  name: string;
}

export interface MarketData {
  priceUsd: number;
  changePercent24Hr: number;
}
