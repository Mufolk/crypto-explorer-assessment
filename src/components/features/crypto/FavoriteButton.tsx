'use client';

import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: (assetId: string) => Promise<void>;
  assetId: string;
  disabled?: boolean;
  className?: string;
}

export function FavoriteButton({ 
  isFavorite, 
  onToggle, 
  assetId, 
  disabled = false,
  className = ''
}: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onToggle(assetId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isFavorite 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
        }
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isFavorite ? (
        <HeartSolidIcon className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </button>
  );
}
