const MAX_ENTRIES = 500;
const cache = new Map<string, { data: unknown; expiry: number }>();

function evictExpired() {
  const now = Date.now();
  for (const [key, val] of cache) {
    if (now > val.expiry) cache.delete(key);
  }
}

function evictOldest() {
  if (cache.size <= MAX_ENTRIES) return;
  const firstKey = cache.keys().next().value;
  if (firstKey) cache.delete(firstKey);
}

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  // Move to end (LRU)
  cache.delete(key);
  cache.set(key, entry);
  return entry.data as T;
}

export function setCache(key: string, data: unknown, ttlMs = 1000 * 60 * 60) {
  evictExpired();
  evictOldest();
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

export function clearCache() {
  cache.clear();
}
