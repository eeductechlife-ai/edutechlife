const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const multiplayerService = require('../services/multiplayerService');

const router = Router();

/**
 * GET /api/multiplayer/leaderboards/:period
 * Get leaderboard for a specific period
 */
router.get('/leaderboards/:period', async (req, res) => {
  try {
    const { period = 'all_time' } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    const validPeriods = ['weekly', 'monthly', 'all_time'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ error: 'Período inválido' });
    }

    const leaderboard = await multiplayerService.getLeaderboard(
      period,
      Math.min(parseInt(limit) || 100, 1000),
      Math.max(parseInt(offset) || 0, 0)
    );

    res.json({
      period,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (e) {
    console.error('Error fetching leaderboard:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/multiplayer/my-ranks
 * Get authenticated student's ranks across periods
 */
router.get('/my-ranks', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const ranks = await multiplayerService.getStudentRanks(userId);
    res.json({ ranks });
  } catch (e) {
    console.error('Error fetching student ranks:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/multiplayer/leaderboard-context
 * Get leaderboard context with nearby competitors
 */
router.get('/leaderboard-context', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { period = 'weekly', window = 5 } = req.query;

    const context = await multiplayerService.getLeaderboardContext(
      userId,
      period,
      parseInt(window) || 5
    );

    res.json(context);
  } catch (e) {
    console.error('Error fetching leaderboard context:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/multiplayer/competitions
 * Get active competition events
 */
router.get('/competitions', async (req, res) => {
  try {
    const { status = 'active', limit = 10 } = req.query;

    const events = await multiplayerService.getCompetitionEvents(
      status,
      Math.min(parseInt(limit) || 10, 100)
    );

    res.json({
      count: events.length,
      events,
    });
  } catch (e) {
    console.error('Error fetching competitions:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/multiplayer/competitions/:id
 * Get competition details with student's participation status
 */
router.get('/competitions/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const details = await multiplayerService.getCompetitionDetails(id, userId);
    res.json(details);
  } catch (e) {
    console.error('Error fetching competition details:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/multiplayer/competitions/:id/join
 * Join a competition
 */
router.post('/competitions/:id/join', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await multiplayerService.joinCompetition(id, userId);

    if (result.alreadyJoined) {
      return res.json({ message: 'Ya estás participando en esta competencia', ...result });
    }

    res.status(201).json({
      success: true,
      message: 'Te has unido a la competencia',
      participantId: result.participantId,
    });
  } catch (e) {
    console.error('Error joining competition:', e);
    if (e.message.includes('llena')) {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/multiplayer/competition-history
 * Get student's competition history
 */
router.get('/competition-history', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20 } = req.query;

    const history = await multiplayerService.getStudentCompetitionHistory(
      userId,
      Math.min(parseInt(limit) || 20, 100)
    );

    res.json({
      count: history.length,
      history,
    });
  } catch (e) {
    console.error('Error fetching competition history:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/multiplayer/competition-stats
 * Get competition statistics for authenticated student
 */
router.get('/competition-stats', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const stats = await multiplayerService.getCompetitionStats(userId);
    res.json(stats);
  } catch (e) {
    console.error('Error fetching competition stats:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
