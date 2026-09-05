/**
 * Session Middleware — Redis-backed user sessions
 *
 * Stores user session data in Redis with 24h TTL.
 * Allows data to persist across server restarts.
 *
 * Usage:
 *   app.use(sessionMiddleware);
 *
 * Then in routes:
 *   await setUserSession(userId, { email, role, lastActivity: Date.now() });
 *   const session = await getUserSession(userId);
 */

const redis = require('../lib/redis');
const logger = require('../utils/logger');

const SESSION_TTL = 24 * 60 * 60; // 24 hours

/**
 * Store session data for a user
 * @param {string} userId — Supabase user ID
 * @param {object} sessionData — arbitrary session data
 * @returns {boolean} success
 */
async function setUserSession(userId, sessionData) {
  if (!userId) {
    logger.warn('setUserSession called without userId');
    return false;
  }

  const key = `user:${userId}`;
  const value = {
    userId,
    ...sessionData,
    createdAt: new Date().toISOString(),
  };

  return await redis.set(key, value, SESSION_TTL);
}

/**
 * Retrieve session data for a user
 * @param {string} userId
 * @returns {object|null} session data or null if not found
 */
async function getUserSession(userId) {
  if (!userId) return null;
  const key = `user:${userId}`;
  return await redis.get(key);
}

/**
 * Delete session (logout)
 * @param {string} userId
 * @returns {boolean} success
 */
async function clearUserSession(userId) {
  if (!userId) return false;
  const key = `user:${userId}`;
  return await redis.del(key);
}

/**
 * Update session data (merge with existing)
 * @param {string} userId
 * @param {object} updates — partial session data
 */
async function updateUserSession(userId, updates) {
  if (!userId) return false;

  const existing = await getUserSession(userId);
  if (!existing) {
    // Create new session if doesn't exist
    return await setUserSession(userId, updates);
  }

  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  return await redis.set(`user:${userId}`, merged, SESSION_TTL);
}

/**
 * Express middleware to attach session helpers to req
 * Usage: app.use(sessionMiddleware);
 */
function sessionMiddleware(req, res, next) {
  req.session = {
    set: (data) => setUserSession(req.userId, data),
    get: () => getUserSession(req.userId),
    clear: () => clearUserSession(req.userId),
    update: (data) => updateUserSession(req.userId, data),
  };
  next();
}

module.exports = {
  sessionMiddleware,
  setUserSession,
  getUserSession,
  clearUserSession,
  updateUserSession,
};
