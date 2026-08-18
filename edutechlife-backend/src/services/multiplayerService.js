const supabase = require('../db/supabase');

/**
 * Multiplayer & Leaderboard Service
 * Manages competitions, rankings, and competitive features
 */

/**
 * Get leaderboard for a specific period
 */
async function getLeaderboard(period = 'all_time', limit = 100, offset = 0) {
  const { data, error } = await supabase
    .from('leaderboards')
    .select(`
      rank, student_user_id, total_points, points_this_period,
      streak_bonus, achievement_count, missions_completed,
      student:students!inner(name, avatar_url, age)
    `)
    .eq('period', period)
    .order('rank', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return (data || []).map(item => ({
    rank: item.rank,
    userId: item.student_user_id,
    totalPoints: item.total_points,
    pointsThisPeriod: item.points_this_period,
    streakBonus: item.streak_bonus,
    achievements: item.achievement_count,
    missionsCompleted: item.missions_completed,
    student: item.student?.[0] || {},
  }));
}

/**
 * Get current student's rank across periods
 */
async function getStudentRanks(userId) {
  const { data, error } = await supabase
    .from('leaderboards')
    .select('period, rank, total_points, points_this_period')
    .eq('student_user_id', userId);

  if (error) throw error;

  const ranks = {};
  (data || []).forEach(row => {
    ranks[row.period] = {
      rank: row.rank,
      totalPoints: row.total_points,
      pointsThisPeriod: row.points_this_period,
    };
  });

  return ranks;
}

/**
 * Get leaderboard position and nearby competitors
 */
async function getLeaderboardContext(userId, period = 'weekly', window = 5) {
  // Get user's rank
  const { data: userRank, error: userError } = await supabase
    .from('leaderboards')
    .select('rank')
    .eq('student_user_id', userId)
    .eq('period', period)
    .maybeSingle();

  if (userError) throw userError;

  if (!userRank) {
    return { userRank: null, nearby: [], context: 'not_ranked' };
  }

  const rank = userRank.rank;
  const minRank = Math.max(1, rank - window);
  const maxRank = rank + window;

  // Get nearby competitors
  const { data: nearby, error: nearbyError } = await supabase
    .from('leaderboards')
    .select(`
      rank, student_user_id, total_points, points_this_period,
      student:students!inner(name, avatar_url)
    `)
    .eq('period', period)
    .gte('rank', minRank)
    .lte('rank', maxRank)
    .order('rank', { ascending: true });

  if (nearbyError) throw nearbyError;

  return {
    userRank: rank,
    nearby: (nearby || []).map(item => ({
      rank: item.rank,
      isUser: item.student_user_id === userId,
      name: item.student?.[0]?.name || 'Estudiante',
      avatarUrl: item.student?.[0]?.avatar_url,
      totalPoints: item.total_points,
      pointsThisPeriod: item.points_this_period,
    })),
    context: rank <= 10 ? 'top_10' : rank <= 50 ? 'top_50' : 'competing',
  };
}

/**
 * Get active competition events
 */
async function getCompetitionEvents(status = 'active', limit = 10) {
  const { data, error } = await supabase
    .from('competition_events')
    .select(`
      id, title, description, event_type, start_date, end_date,
      status, prize_pool, max_participants,
      participants:competition_participants(count)
    `)
    .eq('status', status)
    .lte('start_date', new Date().toISOString())
    .order('end_date', { ascending: true })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    type: event.event_type,
    startDate: event.start_date,
    endDate: event.end_date,
    status: event.status,
    prizePool: event.prize_pool,
    maxParticipants: event.max_participants,
    currentParticipants: event.participants?.[0]?.count || 0,
    progress: calculateEventProgress(event.start_date, event.end_date),
  }));
}

/**
 * Get competition details with student's participation status
 */
async function getCompetitionDetails(competitionId, userId) {
  const { data: event, error: eventError } = await supabase
    .from('competition_events')
    .select('*')
    .eq('id', competitionId)
    .single();

  if (eventError) throw eventError;

  // Check participation
  const { data: participation } = await supabase
    .from('competition_participants')
    .select('*')
    .eq('competition_id', competitionId)
    .eq('student_user_id', userId)
    .maybeSingle();

  // Get top performers
  const { data: topPerformers } = await supabase
    .from('competition_participants')
    .select(`
      final_rank, points_earned_in_event, prize_won,
      student:students!inner(name, avatar_url)
    `)
    .eq('competition_id', competitionId)
    .order('final_rank', { ascending: true })
    .limit(5);

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    type: event.event_type,
    startDate: event.start_date,
    endDate: event.end_date,
    status: event.status,
    rules: event.rules || {},
    prizePool: event.prize_pool,
    isParticipating: !!participation,
    studentParticipation: participation || null,
    topPerformers: (topPerformers || []).map(p => ({
      rank: p.final_rank,
      name: p.student?.[0]?.name || 'Estudiante',
      avatarUrl: p.student?.[0]?.avatar_url,
      points: p.points_earned_in_event,
      prize: p.prize_won,
    })),
  };
}

/**
 * Join a competition
 */
async function joinCompetition(competitionId, userId) {
  // Check capacity
  const { data: event } = await supabase
    .from('competition_events')
    .select('max_participants, status')
    .eq('id', competitionId)
    .single();

  if (event.status !== 'active') {
    throw new Error('Esta competencia no está activa');
  }

  if (event.max_participants) {
    const { data: participants, error: countError } = await supabase
      .from('competition_participants')
      .select('id', { count: 'exact' })
      .eq('competition_id', competitionId);

    if ((participants || []).length >= event.max_participants) {
      throw new Error('La competencia está llena');
    }
  }

  // Check already joined
  const { data: existing } = await supabase
    .from('competition_participants')
    .select('id')
    .eq('competition_id', competitionId)
    .eq('student_user_id', userId)
    .maybeSingle();

  if (existing) {
    return { alreadyJoined: true, participantId: existing.id };
  }

  // Insert participation
  const { data, error } = await supabase
    .from('competition_participants')
    .insert([
      {
        competition_id: competitionId,
        student_user_id: userId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return { success: true, participantId: data.id };
}

/**
 * Get student's competition history
 */
async function getStudentCompetitionHistory(userId, limit = 20) {
  const { data, error } = await supabase
    .from('competition_participants')
    .select(`
      id, joined_at, points_earned_in_event, final_rank, prize_won,
      competition:competition_events(id, title, event_type, end_date, status)
    `)
    .eq('student_user_id', userId)
    .order('joined_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(p => ({
    participantId: p.id,
    joinedAt: p.joined_at,
    points: p.points_earned_in_event,
    rank: p.final_rank,
    prize: p.prize_won,
    competition: {
      id: p.competition.id,
      title: p.competition.title,
      type: p.competition.event_type,
      endDate: p.competition.end_date,
      status: p.competition.status,
    },
  }));
}

/**
 * Get competition stats for student
 */
async function getCompetitionStats(userId) {
  const { data, error } = await supabase
    .from('student_competition_stats')
    .select('*')
    .eq('student_user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;

  return data || {
    studentUserId: userId,
    totalCompetitions: 0,
    competitionsWon: 0,
    competitionsTop3: 0,
    totalPrizePoints: 0,
    winRate: 0,
    bestRank: 999,
  };
}

/**
 * Calculate event progress (0-100)
 */
function calculateEventProgress(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
}

module.exports = {
  getLeaderboard,
  getStudentRanks,
  getLeaderboardContext,
  getCompetitionEvents,
  getCompetitionDetails,
  joinCompetition,
  getStudentCompetitionHistory,
  getCompetitionStats,
};
