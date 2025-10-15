'use client';

import Image from 'next/image';
import { ListedAsset } from '@/types/crypto';
import { formatCurrency, formatPercent } from '@/utils/format';
import { FavoriteButton } from './FavoriteButton';

interface AssetCardProps {
  asset: ListedAsset;
  isFavorite: boolean;
  onToggleFavorite: (assetId: string) => Promise<void>;
  className?: string;
}

export function AssetCard({ 
  asset, 
  isFavorite, 
  onToggleFavorite, 
  className = '' 
}: AssetCardProps) {
  const isPositive = asset.changePercent24Hr >= 0;
  const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const changeBg = isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow
      ${className}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {asset.image ? (
            <div className="flex-shrink-0">
              <Image
                src={asset.image}
                alt={`${asset.name} logo`}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {asset.symbol.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {asset.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {asset.symbol}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(asset.priceUsd)}
            </p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColor} ${changeBg}`}>
              <span className={isPositive ? 'mr-1' : 'mr-1'}>
                {isPositive ? '+' : ''}
              </span>
              {formatPercent(asset.changePercent24Hr)}
            </div>
          </div>
          
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            assetId={asset.id}
          />
        </div>
      </div>
    </div>
  );
}
