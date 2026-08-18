const supabase = require('../db/supabase');

/**
 * Achievement Service
 * Manages badge unlocking, tracking, and analytics
 */

/**
 * Get all achievements (public catalog)
 */
async function getAllAchievements(filters = {}) {
  let query = supabase
    .from('achievements')
    .select(`
      id, slug, title, description, badge_url, badge_locked_url,
      points_reward, rarity, is_hidden, display_order,
      category:achievement_categories(id, slug, label, icon_url)
    `);

  if (filters.category) {
    query = query.eq('category.slug', filters.category);
  }

  if (filters.rarity) {
    query = query.eq('rarity', filters.rarity);
  }

  query = query.eq('is_hidden', false).order('display_order', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Get student's unlocked achievements with unlock dates
 */
async function getStudentAchievements(userId) {
  const { data, error } = await supabase
    .from('student_achievements')
    .select(`
      id, achievement_id, unlocked_at, viewed_at, reward_claimed,
      achievement:achievements(
        id, slug, title, description, badge_url, points_reward, rarity,
        category:achievement_categories(label, slug)
      )
    `)
    .eq('student_user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Check if student has unlocked an achievement
 */
async function hasUnlockedAchievement(userId, achievementSlug) {
  const { data, error } = await supabase
    .from('student_achievements')
    .select('id')
    .eq('student_user_id', userId)
    .eq('achievement.slug', achievementSlug)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

/**
 * Unlock an achievement for a student (idempotent)
 */
async function unlockAchievement(userId, achievementId, metadata = {}) {
  // Get achievement details
  const { data: achievement, error: achError } = await supabase
    .from('achievements')
    .select('id, slug, title, points_reward')
    .eq('id', achievementId)
    .single();

  if (achError) throw achError;
  if (!achievement) throw new Error('Achievement not found');

  // Check if already unlocked
  const { data: existing } = await supabase
    .from('student_achievements')
    .select('id')
    .eq('student_user_id', userId)
    .eq('achievement_id', achievementId)
    .maybeSingle();

  if (existing) {
    return { alreadyUnlocked: true, achievement };
  }

  // Insert achievement unlock
  const { data, error } = await supabase
    .from('student_achievements')
    .insert([
      {
        student_user_id: userId,
        achievement_id: achievementId,
        metadata: metadata || {},
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Award points (deferred to calling code if needed)
  return {
    success: true,
    achievementId,
    achievement,
    points: achievement.points_reward,
    data,
  };
}

/**
 * Batch check and unlock achievements based on criteria
 */
async function checkAndUnlockAchievements(userId, triggerType, triggerData = {}) {
  const achievements = await getAllAchievements();
  const unlockedList = [];

  for (const ach of achievements) {
    const unlocked = await checkUnlockCondition(
      ach.unlock_condition,
      triggerType,
      triggerData,
      userId
    );

    if (unlocked && !(await hasUnlockedAchievement(userId, ach.slug))) {
      const result = await unlockAchievement(userId, ach.id, { triggerType });
      if (result.success) {
        unlockedList.push(result);
      }
    }
  }

  return unlockedList;
}

/**
 * Check if unlock condition is met
 */
async function checkUnlockCondition(condition, triggerType, triggerData, userId) {
  if (!condition || !condition.type) return false;

  const { type, value, event, ...extra } = condition;

  switch (type) {
    case 'points':
      // Get total points for user
      const { data: pointsData } = await supabase
        .from('points_history')
        .select('points')
        .eq('user_id', userId);

      const totalPoints = (pointsData || []).reduce((sum, p) => sum + (p.points || 0), 0);
      return totalPoints >= (value || 0);

    case 'streak':
      // Check current streak
      const { data: streakData } = await supabase
        .from('learning_streaks')
        .select('current_streak')
        .eq('student_id', userId)
        .maybeSingle();

      return (streakData?.current_streak || 0) >= (value || 0);

    case 'leaderboard':
      // Check leaderboard rank
      const { data: rankData } = await supabase
        .from('leaderboards')
        .select('rank')
        .eq('student_user_id', userId)
        .eq('period', extra.period || 'all_time')
        .maybeSingle();

      return (rankData?.rank || 999) <= (value || 0);

    case 'mission':
      // Check mission completion count
      const { data: missions } = await supabase
        .from('missions_completed')
        .select('id')
        .eq('student_id', userId);

      return (missions || []).length >= (value || 0);

    case 'first_event':
      // Check if this is the first occurrence
      return triggerType === event;

    default:
      return false;
  }
}

/**
 * Mark achievement as viewed (for notification dismissal)
 */
async function markAchievementViewed(achievementUnlockId) {
  const { error } = await supabase
    .from('student_achievements')
    .update({ viewed_at: new Date().toISOString() })
    .eq('id', achievementUnlockId);

  if (error) throw error;
  return true;
}

/**
 * Claim points reward for achievement
 */
async function claimAchievementReward(userId, achievementUnlockId) {
  const { data, error } = await supabase
    .from('student_achievements')
    .update({
      reward_claimed: true,
      reward_claimed_at: new Date().toISOString(),
    })
    .eq('id', achievementUnlockId)
    .eq('student_user_id', userId)
    .select()
    .single();

  if (error) throw error;

  // Get points to award (if not already given)
  const { data: ach } = await supabase
    .from('achievements')
    .select('points_reward')
    .eq('id', data.achievement_id)
    .single();

  return { claimed: true, points: ach?.points_reward || 0 };
}

/**
 * Get achievement statistics
 */
async function getAchievementStats(achievementId) {
  const { data, error } = await supabase
    .from('achievement_stats')
    .select('*')
    .eq('achievement_id', achievementId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data || { achievement_id: achievementId, total_unlocks: 0, unlock_percentage: 0 };
}

/**
 * Get achievements by rarity (for display/filtering)
 */
async function getAchievementsByRarity(rarity = 'common') {
  return getAllAchievements({ rarity });
}

module.exports = {
  getAllAchievements,
  getStudentAchievements,
  hasUnlockedAchievement,
  unlockAchievement,
  checkAndUnlockAchievements,
  markAchievementViewed,
  claimAchievementReward,
  getAchievementStats,
  getAchievementsByRarity,
};
