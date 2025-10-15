interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ClientCache {
  private cache = new Map<string, CacheEntry<any>>();

  async get<T>(url: string, ttlMs: number = 60000): Promise<T | null> {
    const cached = this.cache.get(url);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.cache.set(url, {
        data,
        timestamp: Date.now(),
        ttl: ttlMs
      });
      
      return data;
    } catch (error) {
      console.error('Cache fetch error:', error);
      return null;
    }
  }

  clear(url?: string): void {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }

  has(url: string): boolean {
    const cached = this.cache.get(url);
    return cached ? Date.now() - cached.timestamp < cached.ttl : false;
  }
}

export const clientCache = new ClientCache();
