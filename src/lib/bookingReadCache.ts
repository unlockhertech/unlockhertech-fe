/** A bounded, short-lived cache that also shares concurrent reads. */
export class BookingReadCache<T> {
  private readonly values = new Map<string, { value: T; expiresAt: number }>();
  private readonly pending = new Map<string, Promise<T>>();
  private generation = 0;

  private readonly limit: number;

  constructor(limit = 100) { this.limit = limit; }

  async read(key: string, ttlMs: number, fetchValue: () => Promise<T>): Promise<T> {
    const cached = this.values.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.value;
    this.values.delete(key);
    const existing = this.pending.get(key);
    if (existing) return existing;
    const generation = this.generation;
    const request = (async () => {
      const value = await fetchValue();
      if (generation === this.generation) {
        if (this.values.size >= this.limit) {
          const oldest = this.values.keys().next().value;
          if (oldest !== undefined) this.values.delete(oldest);
        }
        this.values.set(key, { value, expiresAt: Date.now() + ttlMs });
      }
      return value;
    })();
    this.pending.set(key, request);
    try {
      return await request;
    } finally {
      if (this.pending.get(key) === request) this.pending.delete(key);
    }
  }

  clear(): void {
    this.generation++;
    this.values.clear();
    this.pending.clear();
  }
}
