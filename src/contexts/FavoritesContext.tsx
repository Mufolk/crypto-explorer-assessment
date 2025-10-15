'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Favorite } from '@/types/crypto';
import { clientCache } from '@/lib/client-cache';
import { getOrCreateAnonUserId } from '@/lib/user-id';

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
  toggleFavorite: (assetId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = getOrCreateAnonUserId();

  const fetchFavorites = useCallback(async () => {
    try {
      setError(null);
      console.log('FavoritesContext - Fetching favorites for userId:', userId);
      // Clear cache to ensure fresh data
      clientCache.clear(`/api/favorites?userId=${userId}`);
      const data = await clientCache.get<Favorite[]>(`/api/favorites?userId=${userId}`, 30000);
      console.log('FavoritesContext - Fetched favorites:', data);
      setFavorites(data || []);
    } catch (err) {
      console.error('FavoritesContext - Failed to fetch favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    }
  }, [userId]);

  const toggleFavorite = useCallback(async (assetId: string) => {
    const isFavorite = favorites.some(fav => fav.assetId === assetId);
    
    try {
      console.log('FavoritesContext - Toggling favorite for assetId:', assetId, 'userId:', userId, 'isFavorite:', isFavorite);
      if (isFavorite) {
        // Remove from favorites
        const favorite = favorites.find(fav => fav.assetId === assetId);
        if (favorite) {
          console.log('FavoritesContext - Removing favorite:', favorite);
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
        console.log('FavoritesContext - Adding favorite for assetId:', assetId, 'userId:', userId);
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
          const errorText = await response.text();
          console.error('FavoritesContext - Failed to add favorite:', response.status, errorText);
          throw new Error('Failed to add favorite');
        }
        
        const newFavorite = await response.json();
        console.log('FavoritesContext - Added favorite:', newFavorite);
        setFavorites(prev => [...prev, newFavorite]);
      }
    } catch (err) {
      console.error('FavoritesContext - Failed to toggle favorite:', err);
      throw err;
    }
  }, [favorites, userId]);

  const refreshFavorites = useCallback(async () => {
    setIsLoading(true);
    await fetchFavorites();
    setIsLoading(false);
  }, [fetchFavorites]);

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      await fetchFavorites();
      setIsLoading(false);
    };
    
    loadFavorites();
  }, [fetchFavorites]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      isLoading,
      error,
      toggleFavorite,
      refreshFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
