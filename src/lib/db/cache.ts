import { openDB, type IDBPDatabase } from "idb";

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  expiresAt: string;
  createdAt: string;
}

interface CacheDB {
  apiCache: {
    key: string;
    value: CacheEntry;
  };
}

const CACHE_DB_NAME = "neuralflow-cache";
const CACHE_DB_VERSION = 1;
const DEFAULT_TTL_MS = 5 * 60 * 1000;

let cacheDbPromise: Promise<IDBPDatabase<CacheDB>> | null = null;

function getCacheDB() {
  if (!cacheDbPromise) {
    cacheDbPromise = openDB<CacheDB>(CACHE_DB_NAME, CACHE_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("apiCache")) {
          db.createObjectStore("apiCache", { keyPath: "key" });
        }
      },
    });
  }
  return cacheDbPromise;
}

export const apiCache = {
  async get<T>(key: string): Promise<T | null> {
    const db = await getCacheDB();
    const entry = await db.get("apiCache", key);
    if (!entry) return null;
    if (new Date(entry.expiresAt) < new Date()) {
      await db.delete("apiCache", key);
      return null;
    }
    return entry.value as T;
  },

  async set<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): Promise<void> {
    const db = await getCacheDB();
    const entry: CacheEntry<T> = {
      key,
      value,
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
      createdAt: new Date().toISOString(),
    };
    await db.put("apiCache", entry);
  },

  async remove(key: string): Promise<void> {
    const db = await getCacheDB();
    await db.delete("apiCache", key);
  },

  async clear(): Promise<void> {
    const db = await getCacheDB();
    await db.clear("apiCache");
  },

  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = DEFAULT_TTL_MS
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await fetcher();
    await this.set(key, fresh, ttlMs);
    return fresh;
  },
};
