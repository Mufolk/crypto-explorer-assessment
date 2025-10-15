'use client';

import { useState, useEffect, useCallback } from 'react';
import { ListedAsset, Favorite } from '@/types/crypto';
import { clientCache } from '@/lib/client-cache';
import { getOrCreateAnonUserId } from '@/lib/user-id';

export function useAssets() {
  const [assets, setAssets] = useState<ListedAsset[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const userId = getOrCreateAnonUserId();

  const fetchAssets = useCallback(async () => {
    try {
      setError(null);
      const data = await clientCache.get<{ data: ListedAsset[] }>('/api/assets', 60000);
      
      if (data?.data) {
        setAssets(data.data);
      } else {
        throw new Error('Failed to fetch assets');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const data = await clientCache.get<Favorite[]>(`/api/favorites?userId=${userId}`, 30000);
      setFavorites(data || []);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  }, [userId]);

  const toggleFavorite = useCallback(async (assetId: string) => {
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
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      throw err;
    }
  }, [favorites, userId]);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 10, 50));
  }, []);

  const retry = useCallback(() => {
    setIsLoading(true);
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAssets(), fetchFavorites()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchAssets, fetchFavorites]);

  const visibleAssets = assets.slice(0, visibleCount);
  const canLoadMore = visibleCount < Math.min(assets.length, 50);

  return {
    assets: visibleAssets,
    allAssets: assets,
    favorites,
    isLoading,
    error,
    visibleCount,
    canLoadMore,
    toggleFavorite,
    loadMore,
    retry,
  };
}
