/**
 * OAuth State Store — Server-side state validation for CSRF protection
 *
 * Implements FIX #3: State binding validation
 * Stores OAuth state tokens server-side with TTL to prevent state reuse attacks
 * and validate that the callback came from an initiated flow.
 *
 * Tries Redis first (production); falls back to in-memory with warning.
 */

const crypto = require('crypto');

class OAuthStateStore {
  constructor() {
    this.memory = new Map(); // Fallback: in-memory store
    this.redis = null;
    this.ttlSeconds = 5 * 60; // 5 minutes: sufficient for OAuth redirect flow
    this.initialized = false;
  }

  /**
   * Initialize with optional Redis client for production deployments
   * @param {RedisClient|null} redisClient - Redis client, or null for in-memory only
   */
  async init(redisClient = null) {
    this.redis = redisClient;
    this.initialized = true;

    if (!this.redis) {
      console.warn(
        '[OAuthStateStore] Redis not available; using in-memory store. ' +
        'State tokens will not persist across server restarts. ' +
        'For production, configure Redis.'
      );
    }
  }

  /**
   * Generate and store a new state token
   * @param {string} provider - OAuth provider (google, facebook)
   * @returns {string} state token for OAuth flow
   */
  async generateState(provider) {
    const randomPart = crypto.randomBytes(24).toString('hex');
    const state = `${provider}:${randomPart}`;

    const key = `oauth_state:${state}`;
    const value = {
      provider,
      createdAt: Date.now(),
      isValid: true,
    };

    try {
      if (this.redis) {
        // Production: Redis
        await this.redis.setex(key, this.ttlSeconds, JSON.stringify(value));
      } else {
        // Fallback: in-memory with setTimeout cleanup
        this.memory.set(key, value);
        setTimeout(() => this.memory.delete(key), this.ttlSeconds * 1000);
      }
    } catch (err) {
      console.error('[OAuthStateStore] Failed to store state:', err.message);
      // Don't fail OAuth; continue with unvalidated state (degraded security)
    }

    return state;
  }

  /**
   * Validate and consume a state token (one-time use)
   * @param {string} state - state from OAuth callback
   * @returns {Promise<object|null>} validated state data, or null if invalid/expired
   */
  async validateState(state) {
    if (!state) return null;

    const key = `oauth_state:${state}`;

    try {
      let value = null;

      if (this.redis) {
        // Production: Redis
        const raw = await this.redis.get(key);
        value = raw ? JSON.parse(raw) : null;
        // Consume: delete after validation
        if (value) await this.redis.del(key);
      } else {
        // Fallback: in-memory
        value = this.memory.get(key);
        if (value) this.memory.delete(key);
      }

      if (!value || !value.isValid) {
        console.warn('[OAuthStateStore] Invalid or expired state token');
        return null;
      }

      // Check TTL (defensive, Redis/setTimeout should have cleaned up)
      const age = Date.now() - value.createdAt;
      if (age > this.ttlSeconds * 1000) {
        console.warn('[OAuthStateStore] State token expired');
        return null;
      }

      return { provider: value.provider };
    } catch (err) {
      console.error('[OAuthStateStore] Failed to validate state:', err.message);
      // Deny callback on validation error (fail-secure)
      return null;
    }
  }
}

module.exports = new OAuthStateStore();
