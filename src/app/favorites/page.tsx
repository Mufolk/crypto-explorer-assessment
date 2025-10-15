'use client';

import { useState, useEffect, useCallback } from 'react';
import { ListedAsset } from '@/types/crypto';
import { AssetList } from '@/components/features/crypto/AssetList';
import { useFavorites } from '@/contexts/FavoritesContext';
import { clientCache } from '@/lib/client-cache';

export default function FavoritesPage() {
  const [favoriteAssets, setFavoriteAssets] = useState<ListedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites, toggleFavorite, refreshFavorites } = useFavorites();

  const fetchFavoriteAssets = useCallback(async () => {
    try {
      // Get all assets to map favorites to full asset data
      const assetsData = await clientCache.get<{ data: ListedAsset[] }>('/api/assets', 60000);
      
      if (assetsData?.data && favorites.length > 0) {
        const favoriteAssetIds = new Set(favorites.map(fav => fav.assetId));
        const favoriteAssetsList = assetsData.data.filter(asset => 
          favoriteAssetIds.has(asset.id)
        );
        setFavoriteAssets(favoriteAssetsList);
      } else {
        setFavoriteAssets([]);
      }
    } catch (err) {
      console.error('Failed to fetch favorite assets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch favorite assets');
    }
  }, [favorites]);

  const retry = async () => {
    setIsLoading(true);
    await Promise.all([refreshFavorites(), fetchFavoriteAssets()]);
    setIsLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchFavoriteAssets();
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchFavoriteAssets]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved cryptocurrency assets
          </p>
        </div>

        <AssetList
          assets={favoriteAssets}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
          showLoadMore={false}
        />
      </div>
    </div>
  );
}
