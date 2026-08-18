/**
 * Metrics API Routes
 *
 * Endpoints for admin dashboard and team operations to fetch:
 * - User engagement metrics (DAU/WAU/MAU)
 * - Feature adoption rates
 * - Learning completion rates
 * - Retention cohorts
 */

const express = require("express");
const router = express.Router();
const {
  getEngagementMetrics,
  getActiveUsers,
  getLessonCompletionRate,
  getFeatureAdoptionRate,
  getRetentionCohort,
} = require("../services/metricsService");
const { verifyAdmin } = require("../middleware/auth");

/**
 * GET /api/admin/metrics/engagement
 * Get comprehensive engagement metrics for admin dashboard
 *
 * Query params:
 * - days: Number of days to look back (default: 30)
 * - productType: "ialabh", "smartboard", or null for all (default: null)
 *
 * Response:
 * {
 *   dau, wau, mau,
 *   completion_rate, avg_session_minutes, parent_engagement_rate,
 *   retention_day1, retention_day7, retention_day30,
 *   features: [{ name, adoption_rate, active_users, total_users, trend, change }]
 * }
 */
router.get("/engagement", verifyAdmin, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const productType = req.query.productType || null;

    const metrics = await getEngagementMetrics({
      days,
      productType,
    });

    if (!metrics) {
      return res.status(500).json({
        error: "Failed to fetch metrics",
      });
    }

    // Add metadata
    res.json({
      ...metrics,
      timestamp: new Date().toISOString(),
      period_days: days,
      product_type: productType || "all",
    });
  } catch (error) {
    console.error("Error in GET /metrics/engagement:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/metrics/active-users
 * Get active user count for a specific period
 *
 * Query params:
 * - period: "day", "week", or "month" (default: "day")
 *
 * Response:
 * { count: number }
 */
router.get("/active-users", verifyAdmin, async (req, res) => {
  try {
    const period = req.query.period || "day";
    if (!["day", "week", "month"].includes(period)) {
      return res.status(400).json({
        error: 'period must be "day", "week", or "month"',
      });
    }

    const count = await getActiveUsers(period);

    res.json({
      count,
      period,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in GET /metrics/active-users:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/metrics/completion-rate
 * Get lesson completion rate
 *
 * Query params:
 * - days: Number of days to look back (default: 30)
 * - productType: "ialabh" or "smartboard" (optional)
 *
 * Response:
 * { completion_rate: number, period_days: number }
 */
router.get("/completion-rate", verifyAdmin, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const productType = req.query.productType || null;

    const rate = await getLessonCompletionRate({
      days,
      productType,
    });

    res.json({
      completion_rate: rate,
      period_days: days,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in GET /metrics/completion-rate:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/metrics/feature-adoption
 * Get adoption rate for specific feature(s)
 *
 * Query params:
 * - feature: Feature name (e.g., "valerio_tts", "crisis_alerts")
 * - days: Number of days to look back (default: 30)
 *
 * Response:
 * {
 *   feature: string,
 *   adoption_rate: number,
 *   active_users: number,
 *   total_users: number
 * }
 */
router.get("/feature-adoption", verifyAdmin, async (req, res) => {
  try {
    const feature = req.query.feature;
    if (!feature) {
      return res.status(400).json({
        error: "feature query parameter required",
      });
    }

    const days = parseInt(req.query.days) || 30;

    const adoption = await getFeatureAdoptionRate(feature, { days });

    res.json({
      feature,
      ...adoption,
      period_days: days,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in GET /metrics/feature-adoption:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/metrics/retention
 * Get retention cohort for users at specific days after signup
 *
 * Query params:
 * - days: Days after signup to check (default: 1)
 * - period: Number of days to analyze (default: 30)
 *
 * Response:
 * { retention_rate: number, days_after: number, period_days: number }
 */
router.get("/retention", verifyAdmin, async (req, res) => {
  try {
    const daysAfter = parseInt(req.query.days) || 1;
    const periodDays = parseInt(req.query.period) || 30;

    if (daysAfter < 0 || periodDays < 1) {
      return res.status(400).json({
        error: "Invalid days or period",
      });
    }

    const rate = await getRetentionCohort(daysAfter, { periodDays });

    res.json({
      retention_rate: rate,
      days_after: daysAfter,
      period_days: periodDays,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in GET /metrics/retention:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/metrics/health
 * Get system health metrics (uptime, error rate, etc.)
 *
 * Response:
 * {
 *   status: "healthy" | "degraded" | "unhealthy",
 *   uptime_percentage: number,
 *   error_rate: number,
 *   api_latency_p95: number (ms),
 *   database_connections: number
 * }
 */
router.get("/health", verifyAdmin, async (req, res) => {
  try {
    // TODO: Integrate with monitoring service (Sentry, NewRelic, etc.)
    // For now, return placeholder data

    res.json({
      status: "healthy",
      uptime_percentage: 99.9,
      error_rate: 0.2,
      api_latency_p95: 350,
      database_connections: 15,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in GET /metrics/health:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/metrics/track-event
 * Track custom event for analytics
 *
 * Body:
 * {
 *   event_name: string,
 *   user_id?: string,
 *   properties?: object
 * }
 */
router.post("/track-event", async (req, res) => {
  try {
    const { event_name, user_id, properties } = req.body;

    if (!event_name) {
      return res.status(400).json({
        error: "event_name required",
      });
    }

    // TODO: Send to analytics service (PostHog, Segment, etc.)
    console.log("Tracked event:", {
      event_name,
      user_id,
      properties,
      timestamp: new Date().toISOString(),
    });

    res.json({
      ok: true,
      event: event_name,
    });
  } catch (error) {
    console.error("Error in POST /metrics/track-event:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
