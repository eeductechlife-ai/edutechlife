import { ALL_LESSONS, BADGE_INFO } from '../../data/ialab'
import { MODULE_NAMES, MODULE_ICONS, MODULE_RESOURCES } from './activityConfig'
import { calculateModuleScore } from './activityUtils'

export function computeActivitiesData({
  activities, completedExams, challengeScores, completedModules,
  completedVideos, completedInfographics, lessonProgress, forumPostCount, forumCommentCount,
}) {
  const trackedActivities = activities || []
  const trackedKey = new Set(
    trackedActivities.map((a) => `${a.activity_type}_${a.module_id}`),
  )

  const examActs = Object.entries(completedExams || {})
    .filter(([_, s]) => s > 0)
    .filter(([mid]) => !trackedKey.has(`exam_${mid}`))
    .map(([mid, score]) => ({
      id: `exam_${mid}`, module_id: parseInt(mid), activity_type: 'exam',
      title: `Examen ${MODULE_NAMES[mid] || `Módulo ${mid}`}`, score,
      completed_at: trackedActivities.find((a) => a.activity_type === 'exam' && a.module_id === parseInt(mid))?.completed_at || new Date().toISOString(),
    }))

  const challengeActs = Object.entries(challengeScores || {})
    .filter(([_, s]) => s > 0)
    .filter(([mid]) => !trackedKey.has(`challenge_${mid}`))
    .map(([mid, score]) => ({
      id: `challenge_${mid}`, module_id: parseInt(mid), activity_type: 'challenge',
      title: `Desafío ${MODULE_NAMES[mid] || `Módulo ${mid}`}`, score,
      completed_at: trackedActivities.find((a) => a.activity_type === 'challenge' && a.module_id === parseInt(mid))?.completed_at || new Date().toISOString(),
    }))

  const moduleActs = (completedModules || [])
    .filter((m) => !examActs.some((e) => e.module_id === m) && !challengeActs.some((c) => c.module_id === m) && !trackedKey.has(`resource_${m}`))
    .map((mid) => ({
      id: `module_${mid}`, module_id: mid, activity_type: 'resource',
      title: `${MODULE_NAMES[mid] || `Módulo ${mid}`} Completado`,
      score: Math.round(calculateModuleScore(mid, MODULE_RESOURCES.find((r) => r.id === mid) || MODULE_RESOURCES[0], completedVideos, completedInfographics, completedExams, challengeScores, completedModules) || 80),
      completed_at: trackedActivities.find((a) => a.module_id === mid)?.completed_at || new Date().toISOString(),
    }))

  const lessonActs = []
  if (lessonProgress) {
    Object.entries(lessonProgress).forEach(([mid, lessons]) => {
      const moduleId = parseInt(mid)
      const moduleLessons = ALL_LESSONS?.[moduleId] || []
      Object.entries(lessons).forEach(([lid, status]) => {
        if (status !== 'completed') return
        const lesson = moduleLessons.find((l) => l.id === parseInt(lid))
        if (!lesson) return
        lessonActs.push({
          id: `lesson_${mid}_${lid}`, module_id: moduleId, activity_type: 'lesson',
          title: lesson.title, score: 100,
          completed_at: trackedActivities.find((a) => a.activity_type === 'lesson' && a.module_id === moduleId)?.completed_at || new Date().toISOString(),
        })
      })
    })
  }

  const totalForum = (forumPostCount || 0) + (forumCommentCount || 0)
  const communityActs = totalForum > 0 && !trackedKey.has('community_0')
    ? [{ id: 'community_0', module_id: 0, activity_type: 'community', title: `${totalForum} aporte${totalForum > 1 ? 's' : ''} en la comunidad`, score: 100, completed_at: new Date().toISOString() }]
    : []

  const all = [...trackedActivities, ...examActs, ...challengeActs, ...moduleActs, ...lessonActs, ...communityActs]
  const seen = new Set()
  return all
    .filter((a) => {
      const k = `${a.activity_type}_${a.module_id}_${a.id}_${trackedKey.has(`${a.activity_type}_${a.module_id}`) ? 'real' : 'synth'}`
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
}

export function computeMonthlyData(sessionStats, timeRange) {
  const days = []
  const now = new Date()
  const sessions = JSON.parse(localStorage.getItem('ialab_session_log') || '[]')
  const range = timeRange === '30d' ? 29 : timeRange === 'all' ? 89 : 6
  for (let i = range; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dStr = d.toDateString()
    const daySessions = sessions.filter((s) => new Date(s.completed_at).toDateString() === dStr)
    days.push({
      label: d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      mins: Math.round(daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60),
      fullDate: d,
    })
  }
  return days
}

export function computeActivityDistribution(activities) {
  const counts = { video: 0, exam: 0, challenge: 0, lesson: 0, community: 0, resource: 0 }
  ;(activities || []).forEach((a) => {
    if (counts[a.activity_type] !== undefined) counts[a.activity_type]++
  })
  const colors = { video: '#004B63', exam: '#00BCD4', challenge: '#10B981', lesson: '#F59E0B', community: '#8B5CF6', resource: '#94A3B8' }
  const labels = { video: 'Video', exam: 'Examen', challenge: 'Desafío', lesson: 'Lección', community: 'Comunidad', resource: 'Recurso' }
  const total = Object.values(counts).reduce((s, v) => s + v, 0)
  return Object.entries(counts)
    .filter(([_, v]) => v > 0)
    .map(([k, v]) => ({ name: labels[k], value: v, pct: total > 0 ? Math.round((v / total) * 100) : 0, color: colors[k], key: k }))
}

export function computeNextBadge(badges, totalLessonsCompleted, streak, completedCount) {
  const earned = new Set(badges || [])
  const allBadges = [
    { id: 'first_lesson', check: () => totalLessonsCompleted >= 1, current: totalLessonsCompleted, target: 1 },
    { id: 'five_lessons', check: () => totalLessonsCompleted >= 5, current: totalLessonsCompleted, target: 5 },
    { id: 'all_lessons', check: () => totalLessonsCompleted >= 15, current: totalLessonsCompleted, target: 15 },
    { id: 'streak_3', check: () => streak >= 3, current: streak, target: 3 },
    { id: 'streak_7', check: () => streak >= 7, current: streak, target: 7 },
    { id: 'first_module', check: () => completedCount >= 1, current: completedCount, target: 1 },
    { id: 'three_modules', check: () => completedCount >= 3, current: completedCount, target: 3 },
    { id: 'all_modules', check: () => completedCount >= 5, current: completedCount, target: 5 },
  ]
  const next = allBadges.find((b) => !earned.has(b.id) && b.current > 0)
  if (!next) return null
  const info = BADGE_INFO?.[next.id]
  if (!info) return null
  return { ...info, badgeId: next.id, current: Math.min(next.current, next.target), target: next.target }
}
