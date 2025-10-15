'use client';

import { useState, useEffect, useCallback } from 'react';
import { ListedAsset, Favorite } from '@/types/crypto';
import { AssetList } from '@/components/features/crypto/AssetList';
import { clientCache } from '@/lib/client-cache';
import { getOrCreateAnonUserId } from '@/lib/user-id';

export default function FavoritesPage() {
  const [favoriteAssets, setFavoriteAssets] = useState<ListedAsset[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = getOrCreateAnonUserId();

  const fetchFavorites = useCallback(async () => {
    try {
      setError(null);
      const data = await clientCache.get<Favorite[]>(`/api/favorites?userId=${userId}`, 30000);
      setFavorites(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    }
  }, [userId]);

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

  const toggleFavorite = async (assetId: string) => {
    const isFavorite = favorites.some(fav => fav.assetId === assetId);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const favorite = favorites.find(fav => fav.assetId === assetId);
        if (favorite) {
          const response = await fetch(`/api/favorites?id=${favorite.id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error('Failed to remove favorite');
          }
          
          setFavorites(prev => prev.filter(fav => fav.assetId !== assetId));
          setFavoriteAssets(prev => prev.filter(asset => asset.id !== assetId));
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            assetId,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }
        
        const newFavorite = await response.json();
        setFavorites(prev => [...prev, newFavorite]);
        
        // If we have the asset data, add it to the list
        const allAssetsData = await clientCache.get<{ data: ListedAsset[] }>('/api/assets', 60000);
        if (allAssetsData?.data) {
          const asset = allAssetsData.data.find(a => a.id === assetId);
          if (asset) {
            setFavoriteAssets(prev => [...prev, asset]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      throw err;
    }
  };

  const retry = async () => {
    setIsLoading(true);
    await Promise.all([fetchFavorites(), fetchFavoriteAssets()]);
    setIsLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchFavorites();
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchFavorites]);

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteAssets();
    } else {
      setFavoriteAssets([]);
    }
  }, [favorites, fetchFavoriteAssets]);

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
