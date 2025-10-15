'use client';

import { useState, useEffect } from 'react';
import { ListedAsset, Favorite } from '@/types/crypto';
import { AssetCard } from './AssetCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

interface AssetListProps {
  assets: ListedAsset[];
  favorites: Favorite[];
  onToggleFavorite: (assetId: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  canLoadMore?: boolean;
  className?: string;
}

export function AssetList({
  assets,
  favorites,
  onToggleFavorite,
  isLoading = false,
  error = null,
  onRetry,
  showLoadMore = false,
  onLoadMore,
  canLoadMore = false,
  className = ''
}: AssetListProps) {
  const [favoriteMap, setFavoriteMap] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('AssetList - favorites changed:', favorites);
    console.log('AssetList - first favorite structure:', favorites[0]);
    const favoriteIds = new Set(favorites.map(fav => fav.assetId));
    console.log('AssetList - favoriteIds:', Array.from(favoriteIds));
    setFavoriteMap(favoriteIds);
  }, [favorites]);

  const handleToggleFavorite = async (assetId: string) => {
    await onToggleFavorite(assetId);
    // The parent component will update the favorites state, which will trigger the useEffect
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load assets"
        message={error}
        {...(onRetry && { onRetry })}
        className={className}
      />
    );
  }

  if (isLoading && assets.length === 0) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (assets.length === 0 && !isLoading) {
    return (
      <EmptyState
        title="No assets found"
        message="There are no cryptocurrency assets to display at the moment."
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <div className="space-y-3">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            isFavorite={favoriteMap.has(asset.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
      
      {showLoadMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={!canLoadMore || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Loading...</span>
              </div>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
