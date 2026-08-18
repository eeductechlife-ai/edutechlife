const supabase = require('../db/supabase');

/**
 * Prediction & Alert Service
 * Manages risk scoring, parent alerts, and learning gap recommendations
 */

/**
 * Get current risk score for a student
 */
async function getStudentRiskScore(userId) {
  const { data, error } = await supabase
    .from('student_risk_scores')
    .select('*')
    .eq('student_user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;

  return data || {
    studentUserId: userId,
    engagementScore: 50,
    performanceScore: 50,
    emotionalRiskScore: 0,
    overallRiskLevel: 'low',
    daysInactive: 0,
    predictedChurnProbability: 0,
  };
}

/**
 * Get all alerts for a parent (with student info)
 */
async function getParentAlerts(parentId, options = {}) {
  const { status = 'unread', limit = 50, offset = 0 } = options;

  let query = supabase
    .from('predictive_alerts')
    .select(`
      id, alert_type, severity, title, message, recommendation,
      created_at, read_at, action_taken,
      student:students!inner(name, avatar_url, age)
    `)
    .eq('parent_user_id', parentId);

  if (status === 'unread') {
    query = query.is('read_at', null);
  }

  query = query.order('created_at', { ascending: false });

  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(alert => ({
    id: alert.id,
    type: alert.alert_type,
    severity: alert.severity,
    title: alert.title,
    message: alert.message,
    recommendation: alert.recommendation,
    createdAt: alert.created_at,
    readAt: alert.read_at,
    actionTaken: alert.action_taken,
    student: alert.student?.[0] || {},
  }));
}

/**
 * Get alerts for a specific student (parent view)
 */
async function getStudentAlerts(parentId, studentId, limit = 20) {
  const { data, error } = await supabase
    .from('predictive_alerts')
    .select('*')
    .eq('parent_user_id', parentId)
    .eq('student_user_id', studentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Create an alert for a parent about their student
 */
async function createAlert(parentId, studentId, alertData) {
  const { type, severity = 'medium', title, message, recommendation } = alertData;

  const { data, error } = await supabase
    .from('predictive_alerts')
    .insert([
      {
        parent_user_id: parentId,
        student_user_id: studentId,
        alert_type: type,
        severity,
        title,
        message,
        recommendation,
        data: alertData.data || {},
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mark alert as read
 */
async function markAlertAsRead(alertId, parentId) {
  const { data, error } = await supabase
    .from('predictive_alerts')
    .update({ read_at: new Date().toISOString() })
    .eq('id', alertId)
    .eq('parent_user_id', parentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Record parent action on an alert
 */
async function recordAlertAction(alertId, parentId, actionType, actionDescription = '') {
  // Update alert
  await supabase
    .from('predictive_alerts')
    .update({
      action_taken: true,
      action_taken_at: new Date().toISOString(),
      action_type: actionType,
    })
    .eq('id', alertId)
    .eq('parent_user_id', parentId);

  // Log action
  const { data, error } = await supabase
    .from('alert_actions')
    .insert([
      {
        alert_id: alertId,
        action_type: actionType,
        action_description: actionDescription,
        action_result: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get learning gap predictions for a student
 */
async function getLearningGaps(studentId, limit = 10) {
  const { data, error } = await supabase
    .from('learning_gap_predictions')
    .select('*')
    .eq('student_user_id', studentId)
    .order('confidence_score', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(gap => ({
    id: gap.id,
    subject: gap.subject_name,
    gapType: gap.gap_type,
    confidence: gap.confidence_score,
    recommendation: gap.recommended_resource,
    priority: gap.priority_level,
    completed: gap.resource_completed,
  }));
}

/**
 * Create a learning gap prediction
 */
async function createLearningGap(studentId, subject, gapData) {
  const { gapType, confidence, resource, priority = 'medium' } = gapData;

  const { data, error } = await supabase
    .from('learning_gap_predictions')
    .upsert(
      {
        student_user_id: studentId,
        subject_name: subject,
        gap_type: gapType,
        confidence_score: confidence,
        recommended_resource: resource,
        priority_level: priority,
      },
      {
        onConflict: 'student_user_id,subject_name,gap_type',
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get summary stats for parent dashboard
 */
async function getParentDashboardSummary(parentId) {
  // Get linked students
  const { data: links } = await supabase
    .from('parent_student_links')
    .select('student_user_id')
    .eq('parent_user_id', parentId);

  const studentIds = (links || []).map(l => l.student_user_id);

  if (studentIds.length === 0) {
    return { students: [] };
  }

  // Get risk scores for all students
  const { data: riskScores } = await supabase
    .from('student_risk_scores')
    .select('*')
    .in('student_user_id', studentIds);

  // Get unread alerts count
  const { data: alerts, error: alertsError } = await supabase
    .from('predictive_alerts')
    .select('id, severity', { count: 'exact' })
    .eq('parent_user_id', parentId)
    .is('read_at', null);

  const unreadCount = alerts?.length || 0;
  const highSeverityCount = (alerts || []).filter(a => a.severity === 'high').length;

  return {
    totalStudents: studentIds.length,
    unreadAlerts: unreadCount,
    highSeverityAlerts: highSeverityCount,
    students: (riskScores || []).map(rs => ({
      userId: rs.student_user_id,
      engagementScore: rs.engagement_score,
      performanceScore: rs.performance_score,
      riskLevel: rs.overall_risk_level,
      lastUpdated: rs.updated_at,
    })),
  };
}

/**
 * Batch compute risk scores (Run nightly)
 */
async function computeAllRiskScores() {
  const { data, error } = await supabase.rpc('compute_risk_scores');
  if (error) throw error;
  return data;
}

/**
 * Get alert template suggestions
 */
async function getAlertSuggestions(studentId) {
  const riskScore = await getStudentRiskScore(studentId);
  const suggestions = [];

  if (riskScore.engagementScore < 30) {
    suggestions.push({
      type: 'disengagement',
      severity: 'high',
      title: 'Baja Actividad Detectada',
      message: `Tu hijo/a ha tenido poca actividad en los últimos 7 días (${riskScore.engagementScore}%).`,
      recommendation: 'Comunícate con él/ella para conocer cómo está y qué necesita.',
    });
  }

  if (riskScore.performanceScore < 40) {
    suggestions.push({
      type: 'performance_drop',
      severity: 'medium',
      title: 'Rendimiento Bajo',
      message: `Notas una baja en el rendimiento académico (${riskScore.performanceScore}%).`,
      recommendation: 'Puedes ayudar revisando las materias en las que tiene dificultad.',
    });
  }

  if (riskScore.predictedChurnProbability > 60) {
    suggestions.push({
      type: 'churn_risk',
      severity: 'high',
      title: 'Riesgo de Desenganche',
      message: 'Existe un alto riesgo de que se desinterese en la plataforma.',
      recommendation: 'Hablemos de qué está sucediendo y cómo podemos mejorar su experiencia.',
    });
  }

  return suggestions;
}

module.exports = {
  getStudentRiskScore,
  getParentAlerts,
  getStudentAlerts,
  createAlert,
  markAlertAsRead,
  recordAlertAction,
  getLearningGaps,
  createLearningGap,
  getParentDashboardSummary,
  computeAllRiskScores,
  getAlertSuggestions,
};
