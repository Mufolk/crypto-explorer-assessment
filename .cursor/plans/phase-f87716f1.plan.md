<!-- f87716f1-5932-4412-8ea4-6d6beb3713c0 901479ca-18a0-47d0-9f24-0382d7a35bd3 -->
# Phase 3 – Frontend Components Plan

## Decisions and Rationale
- **Favorites route: `/favorites` (separate page)**
  - Clear URL, shareable/bookmarkable, simpler navigation/state than tabs.
  - Keeps home focused on discovery; favorites focused on saved assets.
- **User identification: Anonymous localStorage ID**
  - No auth friction; fastest to implement; maps cleanly to existing `/api/favorites`.
  - Generate once and persist via `localStorage` (UUID). Pass to API via header `x-user-id` or query.
- **Asset list: Top 10 with “Load more” up to 50 (single fetch)**
  - Fetch top 50 once from `/api/assets` (already server-cached 60s); client shows 10 and increments by 10.
  - Minimizes network calls; instant load-more UX; honors “all 50 available at some point.”

## Scope
- Replace placeholder home page with assets list and favorites toggling.
- Create `/favorites` page showing user favorites with remove capability.
- Build reusable UI components: `AssetCard`, `FavoriteButton`, `LoadingSpinner`, `ErrorState`, `EmptyState`.
- Client-side fetch utilities with simple in-memory cache + 60s TTL to complement server cache.
- Local storage helper to manage anonymous `userId`.

## Key Files to Add/Edit
- Add `src/components/features/crypto/AssetCard.tsx`
- Add `src/components/features/crypto/FavoriteButton.tsx`
- Add `src/components/features/crypto/AssetList.tsx`
- Add `src/components/ui/LoadingSpinner.tsx`
- Add `src/components/ui/ErrorState.tsx`
- Add `src/components/ui/EmptyState.tsx`
- Add `src/lib/client-cache.ts` (simple fetch cache with TTL)
- Add `src/lib/user-id.ts` (getOrCreateAnonUserId)
- Edit `src/types/crypto.ts` (extend `Asset` with price, change, image)
- Edit `src/components/layout/SiteHeader.tsx` (add nav to Home/Favorites)
- Edit `src/app/page.tsx` (home page list + load more)
- Add `src/app/favorites/page.tsx` (favorites page)

## Data Flow
- Home loads once: `GET /api/assets` → cache (client) 60s TTL; render first 10.
- Load more: increase `visibleCount` by 10 up to 50 (no refetch).
- Favorite toggle:
  - Ensure `userId` via `getOrCreateAnonUserId()`.
  - `POST /api/favorites` to add; `DELETE /api/favorites?id=...` to remove; `GET /api/favorites?userId=...` to hydrate.
- Favorites page displays only user’s favorites; if an asset’s market data is needed, derive from cached assets (fallback to API if cache expired).

## Minimal Interfaces (non-exhaustive)
```typescript
// src/types/crypto.ts (extension)
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  image?: string; // small icon url if provided by API
}
export interface MarketData {
  priceUsd: number;
  changePercent24Hr: number;
}
export interface ListedAsset extends Asset, MarketData {}
```

## Component Sketches (essentials only)
```typescript
// AssetCard props (summary)
interface AssetCardProps {
  asset: ListedAsset;
  isFavorite: boolean;
  onToggleFavorite: (assetId: string) => void;
}
```

## Implementation Steps
1. **Types**: Extend `src/types/crypto.ts` to include `ListedAsset`.
2. **Client Cache**: Create `src/lib/client-cache.ts` with `getCached(url, ttlMs)` wrapper.
3. **User ID**: Create `src/lib/user-id.ts` with `getOrCreateAnonUserId()` using `localStorage` + UUID.
4. **UI Components**: Implement `LoadingSpinner`, `ErrorState`, `EmptyState` (Tailwind, mobile-first).
5. **Crypto Components**:
   - `AssetCard` shows name, symbol, price, 24h change (color-coded), and favorite button.
   - `FavoriteButton` handles optimistic toggle and disabled state during request.
   - `AssetList` manages visible count (10 → 50) and "Load more" button.
6. **Header**: Update `SiteHeader` to include links to `/` and `/favorites`.
7. **Home Page**: Replace `src/app/page.tsx` content with client component that:
   - Fetches assets (top 50) via `/api/assets` using client cache.
   - Fetches favorites for `userId` and merges favorite state.
   - Renders `AssetList` and wires `onToggleFavorite` to `/api/favorites`.
8. **Favorites Page**: Add `src/app/favorites/page.tsx` client component that:
   - Fetches user favorites and maps to assets (using cached list or refetch if absent/expired).
   - Renders `AssetList` filtered to favorites; supports unfavorite.
9. **Edge cases**: Error and empty states, retry button, skeletons while loading.
10. **Accessibility**: Buttons with `aria-pressed`, focus rings, alt text.

## Testing Notes
- Verify first load shows 10 items; load more reveals 20/30/.../50.
- Toggle favorite on home reflects immediately; persists across reloads for same browser.
- Favorites page shows only saved assets; removing reflects on home after navigation.
- Network: assets fetched once per 60s window; load-more causes no network requests.

## Development Guide Addendum (Decisions)
- **Why `/favorites` page**: Simpler mental model, clean URL, direct routing; avoids extra tab state syncing and improves shareability.
- **Why anonymous localStorage ID**: Zero-login friction fits 4-hour target; durable across sessions without backend auth; minimal changes to existing API.
- **Why fetch-50-then-reveal**: Best UX for fast load-more, least network chatter; uses server 60s cache + client TTL for performance; still surfaces all 50 via interaction without pagination complexity now.


### To-dos

- [ ] Extend crypto types to include ListedAsset
- [ ] Create client fetch cache with TTL
- [ ] Add localStorage-based anonymous user ID
- [ ] Build LoadingSpinner, ErrorState, EmptyState components
- [ ] Implement AssetCard, FavoriteButton, AssetList
- [ ] Update SiteHeader with Home and Favorites links
- [ ] Implement home page list with load more and favorites
- [ ] Create favorites page listing user favorites
- [ ] Add error, empty, and accessibility improvements