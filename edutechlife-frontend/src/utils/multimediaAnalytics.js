// Sistema de Analytics para Contenido Multimedia de IALab

class MultimediaAnalytics {
  constructor() {
    this.analyticsKey = 'ialab_multimedia_analytics';
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  initialize() {
    // Inicializar datos de analytics si no existen
    if (!localStorage.getItem(this.analyticsKey)) {
      const initialData = {
        sessions: [],
        events: [],
        userProfile: {},
        totalTimeSpent: 0,
        lastSession: null
      };
      localStorage.setItem(this.analyticsKey, JSON.stringify(initialData));
    }

    // Registrar inicio de sesión
    this.trackSessionStart();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  trackSessionStart() {
    const sessionData = {
      sessionId: this.sessionId,
      startTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    this.updateAnalyticsData((data) => {
      data.sessions.push(sessionData);
      data.lastSession = new Date().toISOString();
      return data;
    });
  }

  trackSessionEnd() {
    this.updateAnalyticsData((data) => {
      const session = data.sessions.find(s => s.sessionId === this.sessionId);
      if (session) {
        session.endTime = new Date().toISOString();
        session.duration = new Date(session.endTime) - new Date(session.startTime);
      }
      return data;
    });
  }

  trackEvent(eventType, eventData = {}) {
    const event = {
      eventId: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      sessionId: this.sessionId,
      eventType,
      timestamp: new Date().toISOString(),
      ...eventData
    };

    this.updateAnalyticsData((data) => {
      data.events.push(event);
      return data;
    });

    // También guardar en el historial de actividad reciente
    this.saveToRecentActivity(eventType, eventData);
  }

  trackContentInteraction(contentType, contentId, action, metadata = {}) {
    this.trackEvent('content_interaction', {
      contentType,
      contentId,
      action,
      metadata
    });
  }

  trackVideoPlayback(videoId, moduleId, duration, progress) {
    this.trackEvent('video_playback', {
      videoId,
      moduleId,
      duration,
      progress,
      playbackType: 'microvideo'
    });

    // Actualizar tiempo total gastado
    this.updateAnalyticsData((data) => {
      data.totalTimeSpent += duration;
      return data;
    });
  }

  trackAudioPlayback(audioId, moduleId, duration, progress) {
    this.trackEvent('audio_playback', {
      audioId,
      moduleId,
      duration,
      progress,
      playbackType: 'audioguide'
    });

    this.updateAnalyticsData((data) => {
      data.totalTimeSpent += duration;
      return data;
    });
  }

  trackContentCompletion(contentType, contentId, timeSpent) {
    this.trackEvent('content_completion', {
      contentType,
      contentId,
      timeSpent,
      completionDate: new Date().toISOString()
    });
  }

  trackNoteCreation(contentType, contentId, noteLength) {
    this.trackEvent('note_creation', {
      contentType,
      contentId,
      noteLength,
      noteType: 'user_note'
    });
  }

  trackBookmark(contentType, contentId, timestamp) {
    this.trackEvent('bookmark_created', {
      contentType,
      contentId,
      timestamp,
      bookmarkType: 'user_bookmark'
    });
  }

  trackDownload(contentType, contentId, resourceType) {
    this.trackEvent('resource_download', {
      contentType,
      contentId,
      resourceType,
      downloadDate: new Date().toISOString()
    });
  }

  updateUserProfile(profileData) {
    this.updateAnalyticsData((data) => {
      data.userProfile = { ...data.userProfile, ...profileData };
      return data;
    });
  }

  saveToRecentActivity(eventType, eventData) {
    const activityKey = 'ialab_recent_activity';
    let activities = JSON.parse(localStorage.getItem(activityKey) || '[]');
    
    const activity = {
      id: 'activity_' + Date.now(),
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      readableTime: new Date().toLocaleTimeString()
    };

    activities.unshift(activity);
    
    // Mantener solo las últimas 50 actividades
    if (activities.length > 50) {
      activities = activities.slice(0, 50);
    }

    localStorage.setItem(activityKey, JSON.stringify(activities));
  }

  updateAnalyticsData(updater) {
    try {
      const data = JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
      const updatedData = updater(data);
      localStorage.setItem(this.analyticsKey, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error updating analytics data:', error);
    }
  }

  getAnalyticsData() {
    try {
      return JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return {};
    }
  }

  getContentStats(contentType) {
    const data = this.getAnalyticsData();
    const events = data.events || [];
    
    const contentEvents = events.filter(event => 
      event.eventType === 'content_interaction' && 
      event.contentType === contentType
    );

    const completionEvents = events.filter(event => 
      event.eventType === 'content_completion' && 
      event.contentType === contentType
    );

    return {
      totalInteractions: contentEvents.length,
      totalCompletions: completionEvents.length,
      uniqueContent: [...new Set(contentEvents.map(e => e.contentId))].length,
      lastInteraction: contentEvents[0]?.timestamp || null
    };
  }

  getUserEngagementStats() {
    const data = this.getAnalyticsData();
    const events = data.events || [];
    const sessions = data.sessions || [];

    const today = new Date().toISOString().split('T')[0];
    const todayEvents = events.filter(event => 
      event.timestamp.startsWith(today)
    );

    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last7DaysEvents = events.filter(event => 
      new Date(event.timestamp) >= last7Days
    );

    return {
      totalSessions: sessions.length,
      totalEvents: events.length,
      todayEvents: todayEvents.length,
      last7DaysEvents: last7DaysEvents.length,
      totalTimeSpent: data.totalTimeSpent || 0,
      averageSessionDuration: this.calculateAverageSessionDuration(sessions)
    };
  }

  calculateAverageSessionDuration(sessions) {
    const completedSessions = sessions.filter(s => s.duration);
    if (completedSessions.length === 0) return 0;
    
    const totalDuration = completedSessions.reduce((sum, session) => sum + session.duration, 0);
    return Math.round(totalDuration / completedSessions.length / 1000); // Convertir a segundos
  }

  getVAKProfile() {
    const data = this.getAnalyticsData();
    const events = data.events || [];

    const visualEvents = events.filter(event => 
      event.contentType === 'microvideo' || 
      event.contentType === 'casestudy'
    ).length;

    const auditoryEvents = events.filter(event => 
      event.contentType === 'audioguide' || 
      event.contentType === 'expertinterview'
    ).length;

    const kinestheticEvents = events.filter(event => 
      event.contentType === 'tutorial' || 
      event.eventType === 'note_creation'
    ).length;

    const totalEvents = visualEvents + auditoryEvents + kinestheticEvents;
    
    if (totalEvents === 0) {
      return { visual: 33, auditory: 33, kinesthetic: 34 };
    }

    return {
      visual: Math.round((visualEvents / totalEvents) * 100),
      auditory: Math.round((auditoryEvents / totalEvents) * 100),
      kinesthetic: Math.round((kinestheticEvents / totalEvents) * 100)
    };
  }

  getRecentActivity(limit = 10) {
    const activityKey = 'ialab_recent_activity';
    try {
      const activities = JSON.parse(localStorage.getItem(activityKey) || '[]');
      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  clearAnalyticsData() {
    localStorage.removeItem(this.analyticsKey);
    localStorage.removeItem('ialab_recent_activity');
    this.initialize();
  }

  exportAnalyticsData() {
    const data = this.getAnalyticsData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ialab_analytics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
let analyticsInstance = null;

export const getMultimediaAnalytics = () => {
  if (!analyticsInstance) {
    analyticsInstance = new MultimediaAnalytics();
  }
  return analyticsInstance;
};

// Hook para uso en componentes React
export const useMultimediaAnalytics = () => {
  return getMultimediaAnalytics();
};

// Event listeners para analytics automáticos
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const analytics = getMultimediaAnalytics();
    analytics.trackSessionEnd();
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const analytics = getMultimediaAnalytics();
      analytics.trackEvent('app_background');
    } else {
      const analytics = getMultimediaAnalytics();
      analytics.trackEvent('app_foreground');
    }
  });
}

export default getMultimediaAnalytics;