'use client';

import { AssetList } from '@/components/features/crypto/AssetList';
import { useAssets } from '@/hooks/useAssets';

export default function Home() {
  const {
    assets,
    favorites,
    isLoading,
    error,
    canLoadMore,
    toggleFavorite,
    loadMore,
    retry,
  } = useAssets();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cryptocurrency Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and track your favorite cryptocurrency assets
          </p>
        </div>

        <AssetList
          assets={assets}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
          showLoadMore={true}
          onLoadMore={loadMore}
          canLoadMore={canLoadMore}
        />
      </div>
    </div>
  );
}
