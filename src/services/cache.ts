// Simple in-memory cache with TTL (Time To Live)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
}

class Cache<T> {
  private store: Map<string, CacheEntry<T>> = new Map();

  set(key: string, data: T, ttlSeconds = 600): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.store.clear();
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.store.delete(key);
      }
    }
  }
}

// Export singleton instances
export const weatherCache = new Cache();
export const cityCache = new Cache();
export const airQualityCache = new Cache();

// Cleanup caches every 5 minutes
setInterval(() => {
  weatherCache.cleanup();
  cityCache.cleanup();
  airQualityCache.cleanup();
}, 5 * 60 * 1000);

export const getCacheKey = (prefix: string, ...params: (string | number)[]): string => {
  return `${prefix}:${params.join(":")}`;
};
