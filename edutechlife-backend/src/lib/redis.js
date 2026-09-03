/**
 * Redis Client — Upstash serverless Redis integration
 *
 * Namespace convention:
 * - user:<userId> — user session data (24h TTL)
 * - ratelimit:<key> — rate limit counters (1h TTL)
 * - session:<sessionId> — session tokens (7d TTL)
 * - cache:<key> — transient data (configurable TTL)
 */

let redis;
try { redis = require('redis'); } catch { redis = null; }
const logger = require('../utils/logger');

// Connection string: redis://:[password]@[host]:[port]
const REDIS_URL = process.env.UPSTASH_REDIS_URL;

let client = null;
let isConnected = false;

/**
 * Initialize Redis client (Upstash serverless)
 */
async function initializeRedis() {
  if (!REDIS_URL || !redis) {
    logger.warn('Redis not configured. Redis features will be disabled (fallback to in-memory).');
    return;
  }

  try {
    client = redis.createClient({ url: REDIS_URL });

    client.on('error', (err) => {
      logger.error('Redis connection error:', { error: err.message });
      isConnected = false;
    });

    client.on('connect', () => {
      logger.info('Redis connected (Upstash)');
      isConnected = true;
    });

    await client.connect();
    isConnected = true;
    logger.info('Redis client initialized');
  } catch (err) {
    logger.error('Failed to initialize Redis:', { error: err.message });
    client = null;
    isConnected = false;
  }
}

/**
 * Set key-value with TTL (seconds)
 * @param {string} key
 * @param {any} value — will be JSON.stringified
 * @param {number} ttlSeconds — default 3600 (1 hour)
 */
async function set(key, value, ttlSeconds = 3600) {
  if (!client || !isConnected) {
    logger.debug('Redis unavailable, skipping set:', { key });
    return false;
  }

  try {
    await client.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (err) {
    logger.error('Redis set error:', { key, error: err.message });
    return false;
  }
}

/**
 * Get value by key
 * @param {string} key
 * @returns {any} parsed JSON or null
 */
async function get(key) {
  if (!client || !isConnected) {
    logger.debug('Redis unavailable, skipping get:', { key });
    return null;
  }

  try {
    const value = await client.get(key);
    if (!value) return null;
    return JSON.parse(value);
  } catch (err) {
    logger.error('Redis get error:', { key, error: err.message });
    return null;
  }
}

/**
 * Delete key
 */
async function del(key) {
  if (!client || !isConnected) {
    logger.debug('Redis unavailable, skipping del:', { key });
    return false;
  }

  try {
    const result = await client.del(key);
    return result === 1;
  } catch (err) {
    logger.error('Redis del error:', { key, error: err.message });
    return false;
  }
}

/**
 * Increment counter (for rate limiting)
 * @param {string} key
 * @param {number} increment — default 1
 * @param {number} ttlSeconds — default 3600
 * @returns {number} new counter value
 */
async function incr(key, increment = 1, ttlSeconds = 3600) {
  if (!client || !isConnected) {
    logger.debug('Redis unavailable, skipping incr:', { key });
    return 0;
  }

  try {
    // Check if key exists; if not, set TTL
    const exists = await client.exists(key);
    let value = await client.incrBy(key, increment);

    if (!exists) {
      await client.expire(key, ttlSeconds);
    }

    return value;
  } catch (err) {
    logger.error('Redis incr error:', { key, error: err.message });
    return 0;
  }
}

/**
 * Get remaining TTL (seconds) for a key
 * @param {string} key
 * @returns {number} remaining seconds (-2 = key doesn't exist, -1 = no TTL)
 */
async function ttl(key) {
  if (!client || !isConnected) {
    logger.debug('Redis unavailable, skipping ttl:', { key });
    return -2;
  }

  try {
    return await client.ttl(key);
  } catch (err) {
    logger.error('Redis ttl error:', { key, error: err.message });
    return -2;
  }
}

/**
 * Check if Redis is connected
 */
function isReady() {
  return isConnected && !!client;
}

/**
 * Close Redis connection gracefully
 */
async function close() {
  if (client && isConnected) {
    try {
      await client.quit();
      isConnected = false;
      logger.info('Redis connection closed');
    } catch (err) {
      logger.error('Error closing Redis:', { error: err.message });
    }
  }
}

/**
 * Health check — ensure Redis responds
 */
async function ping() {
  if (!client || !isConnected) {
    return false;
  }

  try {
    const response = await client.ping();
    return response === 'PONG';
  } catch (err) {
    logger.error('Redis ping failed:', { error: err.message });
    return false;
  }
}

module.exports = {
  initializeRedis,
  set,
  get,
  del,
  incr,
  ttl,
  isReady,
  close,
  ping,
  // Direct client access (for advanced operations)
  getClient: () => client,
};
