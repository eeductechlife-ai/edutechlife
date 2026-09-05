/**
 * Redis Client Tests
 *
 * Tests are skipped if UPSTASH_REDIS_URL is not set (graceful degradation).
 * To run tests locally, set UPSTASH_REDIS_URL=redis://localhost:6379
 */

const redis = require('../../lib/redis');

// Skip all tests if Redis URL not configured
const skipIfNoRedis = process.env.UPSTASH_REDIS_URL ? describe : describe.skip;

skipIfNoRedis('Redis Client', () => {
  beforeAll(async () => {
    // Initialize Redis before all tests
    await redis.initializeRedis();
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 10000 });

  afterAll(async () => {
    // Close connection after all tests
    await redis.close();
  });

  it('should connect to Redis', async () => {
    const isReady = redis.isReady();
    expect(isReady).toBe(true);
  });

  it('should ping Redis', async () => {
    const pong = await redis.ping();
    expect(pong).toBe(true);
  });

  it('should set and get a value', async () => {
    const testKey = `test:${Date.now()}`;
    const testValue = { name: 'John', age: 25 };

    // Set
    const setSuccess = await redis.set(testKey, testValue, 3600);
    expect(setSuccess).toBe(true);

    // Get
    const retrieved = await redis.get(testKey);
    expect(retrieved).toEqual(testValue);
  });

  it('should handle TTL correctly', async () => {
    const testKey = `ttl-test:${Date.now()}`;
    const testValue = { data: 'short-lived' };

    // Set with 2 second TTL
    await redis.set(testKey, testValue, 2);

    // Check TTL immediately
    const ttlBefore = await redis.ttl(testKey);
    expect(ttlBefore).toBeGreaterThan(0);
    expect(ttlBefore).toBeLessThanOrEqual(2);

    // Wait for expiry
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check that key is gone
    const expired = await redis.get(testKey);
    expect(expired).toBeNull();
  });

  it('should delete a key', async () => {
    const testKey = `delete-test:${Date.now()}`;
    await redis.set(testKey, { data: 'to-delete' }, 3600);

    // Verify it exists
    const before = await redis.get(testKey);
    expect(before).not.toBeNull();

    // Delete
    const deleted = await redis.del(testKey);
    expect(deleted).toBe(true);

    // Verify it's gone
    const after = await redis.get(testKey);
    expect(after).toBeNull();
  });

  it('should increment counter', async () => {
    const testKey = `counter:${Date.now()}`;

    // Increment from 0
    const count1 = await redis.incr(testKey, 1, 3600);
    expect(count1).toBe(1);

    // Increment again
    const count2 = await redis.incr(testKey, 1, 3600);
    expect(count2).toBe(2);

    // Increment by 5
    const count3 = await redis.incr(testKey, 5, 3600);
    expect(count3).toBe(7);
  });

  it('should handle concurrent set/get operations', async () => {
    const promises = [];
    const keys = [];

    // Set 10 values concurrently
    for (let i = 0; i < 10; i++) {
      const key = `concurrent:${Date.now()}-${i}`;
      keys.push(key);
      promises.push(redis.set(key, { index: i }, 3600));
    }

    await Promise.all(promises);

    // Get all values
    const getPromises = keys.map(key => redis.get(key));
    const results = await Promise.all(getPromises);

    // Verify all values
    results.forEach((result, index) => {
      expect(result).toEqual({ index });
    });
  });

  it('should return null for non-existent key', async () => {
    const nonExistent = await redis.get('non-existent-key-' + Date.now());
    expect(nonExistent).toBeNull();
  });

  it('should return -2 TTL for non-existent key', async () => {
    const ttl = await redis.ttl('non-existent-ttl-' + Date.now());
    expect(ttl).toBe(-2);
  });

  it('should handle large JSON objects', async () => {
    const testKey = `large-json:${Date.now()}`;
    const largeObject = {
      users: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        metadata: {
          created: new Date().toISOString(),
          tags: ['test', 'redis', `user${i}`],
        },
      })),
      stats: {
        total: 100,
        active: 85,
        inactive: 15,
      },
    };

    await redis.set(testKey, largeObject, 3600);
    const retrieved = await redis.get(testKey);
    expect(retrieved).toEqual(largeObject);
  });
});

// Tests that run without Redis connection
describe('Redis Client (No Connection)', () => {
  it('should gracefully handle missing UPSTASH_REDIS_URL', async () => {
    // This test verifies that operations fail gracefully when Redis is unavailable
    const testKey = 'test-key';
    const testValue = { test: 'data' };

    // If Redis is not ready, set should return false (graceful fallback)
    if (!redis.isReady()) {
      const setSuccess = await redis.set(testKey, testValue, 3600);
      expect(setSuccess).toBe(false);

      const retrieved = await redis.get(testKey);
      expect(retrieved).toBeNull();
    } else {
      // If Redis IS ready, this test is skipped (should be in the other suite)
      expect(redis.isReady()).toBe(true);
    }
  });
});
