const { Router } = require('express');
const { requireAuth, requireVerifiedParentalConsent } = require('../middleware/auth');
const achievementService = require('../services/achievementService');

const router = Router();

/**
 * GET /api/achievements
 * Get all achievement definitions (public catalog)
 */
router.get('/', async (req, res) => {
  try {
    const { category, rarity } = req.query;
    const achievements = await achievementService.getAllAchievements({
      category,
      rarity,
    });
    res.json({ achievements });
  } catch (e) {
    console.error('Error fetching achievements:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/achievements/:id
 * Get achievement details by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const achievements = await achievementService.getAllAchievements();
    const achievement = achievements.find(a => a.id === id);

    if (!achievement) {
      return res.status(404).json({ error: 'Logro no encontrado' });
    }

    const stats = await achievementService.getAchievementStats(id);
    res.json({ achievement, stats });
  } catch (e) {
    console.error('Error fetching achievement:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/achievements/student/:userId
 * Get all unlocked achievements for a student
 * Requires authentication
 */
router.get('/student/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const achievements = await achievementService.getStudentAchievements(userId);
    const totalPoints = achievements.reduce((sum, a) => sum + (a.achievement?.points_reward || 0), 0);

    res.json({
      achievements,
      totalPoints,
      count: achievements.length,
    });
  } catch (e) {
    console.error('Error fetching student achievements:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/achievements/:id/claim
 * Claim reward for an achievement (if not already claimed)
 */
router.post('/:id/claim', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await achievementService.claimAchievementReward(userId, id);
    res.json({ success: result.claimed, pointsAwarded: result.points });
  } catch (e) {
    console.error('Error claiming achievement reward:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/achievements/:id/view
 * Mark achievement as viewed
 */
router.post('/:id/view', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await achievementService.markAchievementViewed(id);
    res.json({ success: true });
  } catch (e) {
    console.error('Error marking achievement viewed:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/achievements/check/:userId
 * Batch check and unlock achievements (internal/cron)
 */
router.post('/check/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { triggerType, triggerData } = req.body || {};

    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const unlockedList = await achievementService.checkAndUnlockAchievements(
      userId,
      triggerType,
      triggerData
    );

    res.json({
      newUnlocks: unlockedList.length,
      achievements: unlockedList,
    });
  } catch (e) {
    console.error('Error checking achievements:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/achievements/rarity/:rarity
 * Get achievements by rarity level
 */
router.get('/rarity/:rarity', async (req, res) => {
  try {
    const { rarity } = req.params;
    const achievements = await achievementService.getAchievementsByRarity(rarity);
    res.json({ achievements, count: achievements.length });
  } catch (e) {
    console.error('Error fetching achievements by rarity:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
