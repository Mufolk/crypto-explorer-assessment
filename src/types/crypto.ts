export interface Asset {
  id: string;
  symbol: string;
  name: string;
  image?: string;
}

export interface MarketData {
  priceUsd: number;
  changePercent24Hr: number;
}

export interface ListedAsset extends Asset, MarketData {}

export interface Favorite {
  id: string;
  userId: string;
  assetId: string;
  createdAt: string;
}
