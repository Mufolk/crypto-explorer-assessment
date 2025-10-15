import { NextRequest, NextResponse } from "next/server";
import { COINGECKO_BASE_URL } from "@/lib/constants";

type CoinGeckoMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
};

let cacheData: CoinGeckoMarket[] | null = null;
let cacheTimeMs = 0;
const CACHE_TTL_MS = 60_000; // 60 seconds

export async function GET(_req: NextRequest) {
  const now = Date.now();
  if (cacheData && now - cacheTimeMs < CACHE_TTL_MS) {
    return NextResponse.json({ source: "cache", data: cacheData });
  }

  const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Adding cache header for edge/CDN friendliness, but we still keep in-memory cache
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch assets from CoinGecko" },
        { status: 502 }
      );
    }
    const data = (await res.json()) as CoinGeckoMarket[];
    cacheData = data;
    cacheTimeMs = now;
    return NextResponse.json({ source: "network", data });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Unknown error" },
      { status: 500 }
    );
  }
}


