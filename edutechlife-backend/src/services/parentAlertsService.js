const supabase = require('../db/supabase');

/**
 * Parent Alerts Service
 *
 * Handles creation and management of parent alerts for:
 * - Crisis: Detected suicidal ideation
 * - Achievement: Badge unlocked
 * - Milestone: Module completed
 * - Offline: Student inactive >30 min
 * - Unusual Activity: Abnormal point spending
 */

/**
 * Check if a crisis alert should be created (deduplication)
 * Prevents alert spam by checking for existing crisis alerts in last 60 minutes
 *
 * @param {string} studentUserId - Student's auth.uid()
 * @param {string} parentUserId - Parent's auth.uid()
 * @returns {Promise<{should_create: boolean, existing_alert_id: string|null, skip_reason: string|null}>}
 */
async function shouldCreateCrisisAlert(studentUserId, parentUserId) {
  try {
    const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Check for recent crisis alerts
    const { data, count, error } = await supabase
      .from('parent_alerts')
      .select('id', { count: 'exact' })
      .eq('parent_user_id', parentUserId)
      .eq('student_user_id', studentUserId)
      .eq('alert_type', 'crisis')
      .gte('created_at', sixtyMinutesAgo)
      .limit(1);

    if (error) {
      console.error('Error checking for duplicate crisis alerts:', error);
      // On error, allow alert creation (fail-open for safety)
      return {
        should_create: true,
        existing_alert_id: null,
        skip_reason: null,
      };
    }

    if (count > 0 && data && data.length > 0) {
      console.log(`[Alert Dedup] Crisis alert already exists for student ${studentUserId} (${data[0].id})`);
      return {
        should_create: false,
        existing_alert_id: data[0].id,
        skip_reason: 'Crisis alert already sent within 60 minutes',
      };
    }

    return {
      should_create: true,
      existing_alert_id: null,
      skip_reason: null,
    };
  } catch (e) {
    console.error('[parentAlertsService] shouldCreateCrisisAlert failed:', e.message);
    // Fail-open: allow alert creation on error
    return {
      should_create: true,
      existing_alert_id: null,
      skip_reason: null,
    };
  }
}

/**
 * Create a crisis alert for a parent (with deduplication)
 * @param {string} parentUserId - Parent's auth.uid() as TEXT
 * @param {string} studentUserId - Student's auth.uid() as TEXT
 * @param {string} studentName - Student's name
 * @param {string} detectedContent - The content that triggered crisis detection
 * @param {string} crisisLevel - 'high', 'medium', or 'low'
 * @param {boolean} skipDedupCheck - Skip deduplication check (default false)
 * @returns {Promise<Object|{skipped: boolean, reason: string, existing_alert_id: string}>} Alert record or skip info
 */
async function createCrisisAlert(parentUserId, studentUserId, studentName, detectedContent, crisisLevel = 'high', skipDedupCheck = false) {
  try {
    // Check for duplicate alerts within last 60 minutes
    if (!skipDedupCheck) {
      const dedupResult = await shouldCreateCrisisAlert(studentUserId, parentUserId);
      if (!dedupResult.should_create) {
        console.log('[Parent Alert] Crisis alert skipped:', dedupResult.skip_reason);
        return {
          skipped: true,
          reason: dedupResult.skip_reason,
          existing_alert_id: dedupResult.existing_alert_id,
        };
      }
    }

    const { data, error } = await supabase
      .from('parent_alerts')
      .insert([
        {
          parent_user_id: parentUserId,
          student_user_id: studentUserId,
          alert_type: 'crisis',
          title: `⚠️ Alerta de Crisis — ${studentName}`,
          body: crisisLevel === 'high'
            ? `Se detectó contenido preocupante en la conversación de ${studentName}. Por favor, contacta a tu hijo/a de inmediato.`
            : `Se detectó contenido que requiere atención en la conversación de ${studentName}. Monitorea su estado.`,
          data: {
            crisis_level: crisisLevel,
            detected_content: detectedContent,
            detected_at: new Date().toISOString(),
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating crisis alert:', error);
      throw error;
    }

    console.log('[Parent Alert] Crisis alert created:', data.id);
    return { ...data, skipped: false };
  } catch (e) {
    console.error('[parentAlertsService] createCrisisAlert failed:', e.message);
    throw e;
  }
}

/**
 * Create an achievement alert for a parent
 * @param {string} parentUserId - Parent's auth.uid() as TEXT
 * @param {string} studentUserId - Student's auth.uid() as TEXT
 * @param {string} studentName - Student's name
 * @param {Object} achievement - Achievement object with title, description, badge_url
 * @returns {Promise<Object>} Alert record
 */
async function createAchievementAlert(parentUserId, studentUserId, studentName, achievement) {
  try {
    const { data, error } = await supabase
      .from('parent_alerts')
      .insert([
        {
          parent_user_id: parentUserId,
          student_user_id: studentUserId,
          alert_type: 'achievement',
          title: `🎉 ${studentName} desbloqueó una medalla`,
          body: achievement.description || `${studentName} obtuvo el logro: "${achievement.title}"`,
          data: {
            achievement_type: achievement.achievement_type,
            achievement_title: achievement.title,
            points_awarded: achievement.points_awarded || 0,
            badge_url: achievement.badge_url || null,
            earned_at: achievement.earned_at,
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating achievement alert:', error);
      throw error;
    }

    console.log('[Parent Alert] Achievement alert created:', data.id);
    return data;
  } catch (e) {
    console.error('[parentAlertsService] createAchievementAlert failed:', e.message);
    throw e;
  }
}

/**
 * Create a milestone alert for a parent
 * @param {string} parentUserId - Parent's auth.uid() as TEXT
 * @param {string} studentUserId - Student's auth.uid() as TEXT
 * @param {string} studentName - Student's name
 * @param {string} moduleName - Name of completed module
 * @param {Object} milestone - Milestone data
 * @returns {Promise<Object>} Alert record
 */
async function createMilestoneAlert(parentUserId, studentUserId, studentName, moduleName, milestone = {}) {
  try {
    const { data, error } = await supabase
      .from('parent_alerts')
      .insert([
        {
          parent_user_id: parentUserId,
          student_user_id: studentUserId,
          alert_type: 'milestone',
          title: `✅ ${studentName} completó "${moduleName}"`,
          body: `¡Felicitaciones! ${studentName} ha completado el módulo "${moduleName}" con éxito.`,
          data: {
            module_name: moduleName,
            completion_date: new Date().toISOString(),
            ...milestone,
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating milestone alert:', error);
      throw error;
    }

    console.log('[Parent Alert] Milestone alert created:', data.id);
    return data;
  } catch (e) {
    console.error('[parentAlertsService] createMilestoneAlert failed:', e.message);
    throw e;
  }
}

/**
 * Create an offline alert for a parent
 * @param {string} parentUserId - Parent's auth.uid() as TEXT
 * @param {string} studentUserId - Student's auth.uid() as TEXT
 * @param {string} studentName - Student's name
 * @param {number} minutesOffline - Minutes since last activity
 * @returns {Promise<Object>} Alert record
 */
async function createOfflineAlert(parentUserId, studentUserId, studentName, minutesOffline = 30) {
  try {
    const { data, error } = await supabase
      .from('parent_alerts')
      .insert([
        {
          parent_user_id: parentUserId,
          student_user_id: studentUserId,
          alert_type: 'offline',
          title: `📴 ${studentName} lleva ${minutesOffline} minutos sin actividad`,
          body: `${studentName} ha estado desconectado por más de ${minutesOffline} minutos. Si esperas que esté estudiando, verifica su conexión.`,
          data: {
            minutes_offline: minutesOffline,
            alert_threshold: 30,
            detected_at: new Date().toISOString(),
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating offline alert:', error);
      throw error;
    }

    console.log('[Parent Alert] Offline alert created:', data.id);
    return data;
  } catch (e) {
    console.error('[parentAlertsService] createOfflineAlert failed:', e.message);
    throw e;
  }
}

/**
 * Create an unusual activity alert for a parent
 * @param {string} parentUserId - Parent's auth.uid() as TEXT
 * @param {string} studentUserId - Student's auth.uid() as TEXT
 * @param {string} studentName - Student's name
 * @param {Object} activity - Activity details
 * @returns {Promise<Object>} Alert record
 */
async function createUnusualActivityAlert(parentUserId, studentUserId, studentName, activity) {
  try {
    const { data, error } = await supabase
      .from('parent_alerts')
      .insert([
        {
          parent_user_id: parentUserId,
          student_user_id: studentUserId,
          alert_type: 'unusual_activity',
          title: `⚡ Actividad inusual: ${studentName}`,
          body: activity.description || `Se detectó actividad inusual en la cuenta de ${studentName}.`,
          data: {
            activity_type: activity.type || 'unknown',
            activity_description: activity.description,
            details: activity.details || null,
            detected_at: new Date().toISOString(),
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating unusual activity alert:', error);
      throw error;
    }

    console.log('[Parent Alert] Unusual activity alert created:', data.id);
    return data;
  } catch (e) {
    console.error('[parentAlertsService] createUnusualActivityAlert failed:', e.message);
    throw e;
  }
}

/**
 * Mark alert as read
 * @param {string} alertId - UUID of the alert
 * @returns {Promise<Object>} Updated alert record
 */
async function markAlertAsRead(alertId) {
  try {
    const { data, error } = await supabase
      .from('parent_alerts')
      .update({ read_at: new Date().toISOString() })
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }

    return data;
  } catch (e) {
    console.error('[parentAlertsService] markAlertAsRead failed:', e.message);
    throw e;
  }
}

/**
 * Get alerts for a parent (paginated)
 * @param {string} parentUserId - Parent's auth.uid() as TEXT
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page (default 20, max 100)
 * @param {Object} filters - Optional filters: { type, read, search }
 * @returns {Promise<{data: Array, count: number, hasMore: boolean}>}
 */
async function getParentAlerts(parentUserId, page = 1, limit = 20, filters = {}) {
  try {
    // Validate and sanitize inputs
    limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    page = Math.max(parseInt(page) || 1, 1);
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('parent_alerts')
      .select('*', { count: 'exact' })
      .eq('parent_user_id', parentUserId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.type) {
      query = query.eq('alert_type', filters.type);
    }

    if (filters.read !== undefined) {
      if (filters.read === true) {
        query = query.not('read_at', 'is', null);
      } else if (filters.read === false) {
        query = query.is('read_at', null);
      }
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching parent alerts:', error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      hasMore: (page * limit) < (count || 0),
      page,
      limit,
    };
  } catch (e) {
    console.error('[parentAlertsService] getParentAlerts failed:', e.message);
    throw e;
  }
}

/**
 * Delete an alert
 * @param {string} alertId - UUID of the alert
 * @returns {Promise<void>}
 */
async function deleteAlert(alertId) {
  try {
    const { error } = await supabase
      .from('parent_alerts')
      .delete()
      .eq('id', alertId);

    if (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }

    console.log('[Parent Alert] Alert deleted:', alertId);
  } catch (e) {
    console.error('[parentAlertsService] deleteAlert failed:', e.message);
    throw e;
  }
}

/**
 * Get unread alert count for a parent
 * @param {string} parentUserId - Parent's auth.uid() as TEXT
 * @returns {Promise<number>} Count of unread alerts
 */
async function getUnreadAlertCount(parentUserId) {
  try {
    const { count, error } = await supabase
      .from('parent_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('parent_user_id', parentUserId)
      .is('read_at', null);

    if (error) {
      console.error('Error fetching unread alert count:', error);
      throw error;
    }

    return count || 0;
  } catch (e) {
    console.error('[parentAlertsService] getUnreadAlertCount failed:', e.message);
    throw e;
  }
}

module.exports = {
  shouldCreateCrisisAlert,
  createCrisisAlert,
  createAchievementAlert,
  createMilestoneAlert,
  createOfflineAlert,
  createUnusualActivityAlert,
  markAlertAsRead,
  getParentAlerts,
  deleteAlert,
  getUnreadAlertCount,
};
