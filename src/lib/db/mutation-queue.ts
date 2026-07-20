import { openDB, type IDBPDatabase } from "idb";

export interface QueuedMutation {
  id: string;
  endpoint: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  body: unknown;
  headers: Record<string, string>;
  createdAt: string;
  retryCount: number;
  status: "pending" | "processing" | "failed";
}

interface MutationQueueDB {
  mutationQueue: {
    key: string;
    value: QueuedMutation;
    indexes: { "by-status": string; "by-created": string };
  };
}

const QUEUE_DB_NAME = "neuralflow-mutations";
const QUEUE_DB_VERSION = 1;
const MAX_RETRY_COUNT = 3;

let queueDbPromise: Promise<IDBPDatabase<MutationQueueDB>> | null = null;

function getQueueDB() {
  if (!queueDbPromise) {
    queueDbPromise = openDB<MutationQueueDB>(QUEUE_DB_NAME, QUEUE_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("mutationQueue")) {
          const store = db.createObjectStore("mutationQueue", { keyPath: "id" });
          store.createIndex("by-status", "status");
          store.createIndex("by-created", "createdAt");
        }
      },
    });
  }
  return queueDbPromise;
}

export const mutationQueue = {
  async enqueue(
    mutation: Omit<QueuedMutation, "id" | "createdAt" | "retryCount" | "status">
  ): Promise<QueuedMutation> {
    const db = await getQueueDB();
    const entry: QueuedMutation = {
      ...mutation,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: "pending",
    };
    await db.put("mutationQueue", entry);
    return entry;
  },

  async getAll(): Promise<QueuedMutation[]> {
    const db = await getQueueDB();
    const all = await db.getAll("mutationQueue");
    return all.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },

  async getPending(): Promise<QueuedMutation[]> {
    const db = await getQueueDB();
    return db.getAllFromIndex("mutationQueue", "by-status", "pending");
  },

  async markProcessing(id: string): Promise<void> {
    const db = await getQueueDB();
    const item = await db.get("mutationQueue", id);
    if (item) {
      item.status = "processing";
      await db.put("mutationQueue", item);
    }
  },

  async markFailed(id: string): Promise<void> {
    const db = await getQueueDB();
    const item = await db.get("mutationQueue", id);
    if (item) {
      item.retryCount += 1;
      item.status = item.retryCount >= MAX_RETRY_COUNT ? "failed" : "pending";
      await db.put("mutationQueue", item);
    }
  },

  async remove(id: string): Promise<void> {
    const db = await getQueueDB();
    await db.delete("mutationQueue", id);
  },

  async clear(): Promise<void> {
    const db = await getQueueDB();
    await db.clear("mutationQueue");
  },

  async count(): Promise<number> {
    const db = await getQueueDB();
    return db.count("mutationQueue");
  },

  async replay(
    executor: (mutation: QueuedMutation) => Promise<boolean>
  ): Promise<{ succeeded: number; failed: number }> {
    const pending = await this.getPending();
    let succeeded = 0;
    let failed = 0;

    for (const mutation of pending) {
      await this.markProcessing(mutation.id);
      try {
        const ok = await executor(mutation);
        if (ok) {
          await this.remove(mutation.id);
          succeeded += 1;
        } else {
          await this.markFailed(mutation.id);
          failed += 1;
        }
      } catch {
        await this.markFailed(mutation.id);
        failed += 1;
      }
    }

    return { succeeded, failed };
  },
};
