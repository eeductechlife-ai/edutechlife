class AudioCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  get(profile, text) {
    const key = `${profile}:${text}`;
    const entry = this.cache.get(key);
    if (!entry) return null;
    const idx = this.accessOrder.indexOf(key);
    if (idx > -1) {
      this.accessOrder.splice(idx, 1);
      this.accessOrder.push(key);
    }
    return entry.audioContent;
  }

  set(profile, text, audioContent) {
    const key = `${profile}:${text}`;
    if (this.cache.has(key)) {
      const idx = this.accessOrder.indexOf(key);
      if (idx > -1) this.accessOrder.splice(idx, 1);
    }
    if (this.accessOrder.length >= this.maxSize) {
      const oldest = this.accessOrder.shift();
      this.cache.delete(oldest);
    }
    this.cache.set(key, { audioContent, timestamp: Date.now() });
    this.accessOrder.push(key);
  }

  get size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }
}

const audioCache = new AudioCache(50);

export { AudioCache, audioCache };
