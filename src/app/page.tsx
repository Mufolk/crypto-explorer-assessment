'use client';

import { AssetList } from '@/components/features/crypto/AssetList';
import { useAssetsOnly } from '@/hooks/useAssetsOnly';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function Home() {
  const {
    assets,
    isLoading,
    error,
    canLoadMore,
    loadMore,
    retry,
  } = useAssetsOnly();

  const { favorites, toggleFavorite } = useFavorites();

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
