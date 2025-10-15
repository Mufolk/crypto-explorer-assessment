'use client';

import { useState, useEffect, useCallback } from 'react';
import { ListedAsset } from '@/types/crypto';
import { clientCache } from '@/lib/client-cache';

export function useAssetsOnly() {
  const [assets, setAssets] = useState<ListedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

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
      await fetchAssets();
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchAssets]);

  const visibleAssets = assets.slice(0, visibleCount);
  const canLoadMore = visibleCount < Math.min(assets.length, 50);

  return {
    assets: visibleAssets,
    allAssets: assets,
    isLoading,
    error,
    visibleCount,
    canLoadMore,
    loadMore,
    retry,
  };
}
