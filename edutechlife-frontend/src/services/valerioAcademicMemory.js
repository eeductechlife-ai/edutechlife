/**
 * Valerio Academic Memory System
 * Stores and analyzes student learning patterns for personalized coaching
 */

export class ValerioAcademicMemory {
  constructor(supabaseClient, userId) {
    this.db = supabaseClient;
    this.userId = userId;
    this.tableName = 'valerio_academic_memory';
  }

  /**
   * Record academic session with learning metadata
   */
  async recordSession({
    moduleId,
    topicsCovered = [],
    questionsAsked = [],
    weakAreasIdentified = [],
    progressMade = 0,
    nextSteps = [],
    sentiment = 'neutral', // 'frustrated' | 'confused' | 'confident' | 'engaged' | 'neutral'
    lessonId = null,
    challengeId = null,
  }) {
    try {
      const session = {
        user_id: this.userId,
        module_id: moduleId,
        session_date: new Date().toISOString(),
        topics_covered: topicsCovered,
        questions_asked: questionsAsked,
        weak_areas: weakAreasIdentified,
        progress_percentage: progressMade,
        recommended_next_steps: nextSteps,
        student_sentiment: sentiment,
        lesson_id: lessonId,
        challenge_id: challengeId,
      };

      const { error } = await this.db
        .from(this.tableName)
        .insert([session]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('[valerioAcademicMemory] recordSession failed:', err.message);
      return { success: false, error: err };
    }
  }

  /**
   * Get comprehensive student profile from historical data
   */
  async getStudentProfile() {
    try {
      const { data, error } = await this.db
        .from(this.tableName)
        .select('*')
        .eq('user_id', this.userId)
        .order('session_date', { ascending: false })
        .limit(20);

      if (error) throw error;
      if (!data || data.length === 0) return this._emptyProfile();

      return {
        strongTopics: this._analyzeStrong(data),
        weakTopics: this._analyzeWeak(data),
        learningPace: this._analyzePace(data),
        preferredStyle: this._analyzeStyle(data),
        recentSentiment: data[0]?.student_sentiment || 'neutral',
        streakDays: this._calculateStreak(data),
        focusAreas: this._prioritizeFocus(data),
        sessionCount: data.length,
        lastSession: data[0]?.session_date,
      };
    } catch (err) {
      console.warn('[valerioAcademicMemory] getStudentProfile failed:', err.message);
      return this._emptyProfile();
    }
  }

  /**
   * Get personalized context to inject into system prompt
   */
  async buildPersonalizedContext() {
    const profile = await this.getStudentProfile();

    if (profile.sessionCount === 0) {
      return {
        hasHistory: false,
        instruction: 'This is a new student. Provide clear, supportive guidance.',
      };
    }

    return {
      hasHistory: true,
      strongTopics: profile.strongTopics,
      weakTopics: profile.weakTopics,
      learningPace: profile.learningPace,
      preferredStyle: profile.preferredStyle,
      recentSentiment: profile.recentSentiment,
      focusAreas: profile.focusAreas,
      instruction: `
El estudiante ha completado ${profile.sessionCount} sesiones.
${profile.weakTopics.length > 0 ? `Tiene dificultad en: ${profile.weakTopics.join(', ')}` : 'Va bien en los temas.'}
${profile.strongTopics.length > 0 ? `Domina: ${profile.strongTopics.join(', ')}` : ''}
Ritmo: ${profile.learningPace}.
Estado actual: ${this._sentimentLabel(profile.recentSentiment)}.
Enfoque recomendado: ${profile.focusAreas[0] || 'reforzar conceptos base'}.`,
    };
  }

  /**
   * Get module-specific insights
   */
  async getModuleInsights(moduleId) {
    try {
      const { data, error } = await this.db
        .from(this.tableName)
        .select('*')
        .eq('user_id', this.userId)
        .eq('module_id', moduleId)
        .order('session_date', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return null;

      return {
        sessionCount: data.length,
        topicsExplored: [
          ...new Set(data.flatMap(d => d.topics_covered || [])),
        ],
        persistentWeakness: data
          .flatMap(d => d.weak_areas || [])
          .reduce((acc, topic) => {
            acc[topic] = (acc[topic] || 0) + 1;
            return acc;
          }, {}),
        averageProgress: Math.round(
          data.reduce((sum, d) => sum + (d.progress_percentage || 0), 0) / data.length
        ),
      };
    } catch (err) {
      console.warn('[valerioAcademicMemory] getModuleInsights failed:', err.message);
      return null;
    }
  }

  // ── Private helpers ────────────────────────────────────────────────

  _emptyProfile() {
    return {
      strongTopics: [],
      weakTopics: [],
      learningPace: 'steady',
      preferredStyle: 'balanced',
      recentSentiment: 'neutral',
      streakDays: 0,
      focusAreas: [],
      sessionCount: 0,
      lastSession: null,
    };
  }

  _analyzeStrong(data) {
    if (data.length === 0) return [];
    const topicFreq = {};
    data.forEach(s => {
      (s.topics_covered || []).forEach(topic => {
        topicFreq[topic] = (topicFreq[topic] || 0) + 1;
      });
    });
    return Object.entries(topicFreq)
      .filter(([_, freq]) => freq >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic)
      .slice(0, 3);
  }

  _analyzeWeak(data) {
    if (data.length === 0) return [];
    const topicFreq = {};
    data.forEach(s => {
      (s.weak_areas || []).forEach(topic => {
        topicFreq[topic] = (topicFreq[topic] || 0) + 1;
      });
    });
    return Object.entries(topicFreq)
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic)
      .slice(0, 3);
  }

  _analyzePace(data) {
    if (data.length === 0) return 'steady';
    const avgProgress = data.reduce((sum, d) => sum + (d.progress_percentage || 0), 0) / data.length;
    if (avgProgress >= 80) return 'fast';
    if (avgProgress >= 60) return 'steady';
    return 'deliberate';
  }

  _analyzeStyle(data) {
    // Could be extended to analyze question patterns for visual/audio/kinesthetic preferences
    return 'balanced';
  }

  _calculateStreak(data) {
    if (data.length === 0) return 0;
    let streak = 0;
    const sortedByDate = [...data].sort(
      (a, b) => new Date(b.session_date) - new Date(a.session_date)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedByDate.length; i++) {
      const sessionDate = new Date(sortedByDate[i].session_date);
      sessionDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (sessionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  _prioritizeFocus(data) {
    if (data.length === 0) return [];
    const weakAreas = this._analyzeWeak(data);
    const nextSteps = [
      ...new Set(data.flatMap(d => d.recommended_next_steps || [])),
    ];
    return [...weakAreas, ...nextSteps].slice(0, 3);
  }

  _sentimentLabel(sentiment) {
    const labels = {
      frustrated: 'necesita motivación',
      confused: 'necesita claridad',
      confident: 'va bien',
      engaged: 'muy motivado',
      neutral: 'normal',
    };
    return labels[sentiment] || 'normal';
  }
}
