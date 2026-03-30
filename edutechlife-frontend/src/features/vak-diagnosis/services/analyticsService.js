class AnalyticsService {
  constructor() {
    this.apiEndpoint = 'https://api.edutechlife.com/analytics';
    this.localStorageKey = 'edutechlife_vak_analytics';
    this.queue = [];
    this.isSending = false;
    this.userId = this.getUserId();
    this.sessionId = this.generateSessionId();
    
    this.init();
  }

  init() {
    // Cargar cola pendiente de localStorage
    this.loadQueue();
    
    // Enviar datos pendientes al cargar
    this.sendQueue();
    
    // Configurar evento beforeunload para enviar datos pendientes
    window.addEventListener('beforeunload', () => {
      this.sendQueue(true); // Envío sincrónico
    });
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getUserId() {
    let userId = localStorage.getItem('edutechlife_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('edutechlife_user_id', userId);
    }
    return userId;
  }

  loadQueue() {
    try {
      const savedQueue = localStorage.getItem(this.localStorageKey);
      if (savedQueue) {
        this.queue = JSON.parse(savedQueue);
      }
    } catch (error) {
      console.error('Error loading analytics queue:', error);
      this.queue = [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving analytics queue:', error);
    }
  }

  async sendQueue(sync = false) {
    if (this.isSending || this.queue.length === 0) return;

    this.isSending = true;
    const eventsToSend = [...this.queue];
    
    try {
      if (sync) {
        // Envío sincrónico (para beforeunload)
        navigator.sendBeacon(this.apiEndpoint + '/batch', JSON.stringify({
          userId: this.userId,
          sessionId: this.sessionId,
          events: eventsToSend
        }));
        
        // Limpiar cola local
        this.queue = this.queue.filter(event => !eventsToSend.includes(event));
        this.saveQueue();
      } else {
        // Envío asíncrono normal
        const response = await fetch(this.apiEndpoint + '/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.userId,
            sessionId: this.sessionId,
            events: eventsToSend
          })
        });

        if (response.ok) {
          // Eliminar eventos enviados de la cola
          this.queue = this.queue.filter(event => !eventsToSend.includes(event));
          this.saveQueue();
        }
      }
    } catch (error) {
      console.error('Error sending analytics:', error);
    } finally {
      this.isSending = false;
    }
  }

  trackEvent(eventType, data = {}) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        userId: this.userId,
        sessionId: this.sessionId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
      }
    };

    this.queue.push(event);
    this.saveQueue();

    // Enviar después de un breve delay (excepto para eventos críticos)
    if (eventType === 'diagnosis_completed' || eventType === 'lead_captured') {
      setTimeout(() => this.sendQueue(), 100);
    } else {
      setTimeout(() => this.sendQueue(), 1000);
    }

    return event;
  }

  // Métodos específicos para eventos VAK
  trackDiagnosisStarted(userData) {
    return this.trackEvent('diagnosis_started', {
      userName: userData.name,
      userAge: userData.age,
      userEmail: userData.email,
      timestamp: new Date().toISOString()
    });
  }

  trackQuestionAnswered(questionId, answer, questionNumber, totalQuestions) {
    return this.trackEvent('question_answered', {
      questionId,
      answer,
      questionNumber,
      totalQuestions,
      progress: Math.round((questionNumber / totalQuestions) * 100)
    });
  }

  trackDiagnosisCompleted(results, userData) {
    return this.trackEvent('diagnosis_completed', {
      dominantStyle: results.dominant,
      percentages: results.percentages,
      userName: userData.name,
      userEmail: userData.email,
      totalScore: results.percentage
    });
  }

  trackVoiceToggle(enabled) {
    return this.trackEvent('voice_toggled', {
      voiceEnabled: enabled,
      browserSupport: 'speechSynthesis' in window
    });
  }

  trackResultsShared(method, dominantStyle) {
    return this.trackEvent('results_shared', {
      shareMethod: method,
      dominantStyle,
      timestamp: new Date().toISOString()
    });
  }

  trackPDFDownloaded(userName, dominantStyle) {
    return this.trackEvent('pdf_downloaded', {
      userName,
      dominantStyle,
      timestamp: new Date().toISOString()
    });
  }

  trackConsultationScheduled(userData) {
    return this.trackEvent('consultation_scheduled', {
      userName: userData.name,
      userEmail: userData.email,
      timestamp: new Date().toISOString()
    });
  }

  trackError(errorType, errorMessage, context = {}) {
    return this.trackEvent('error_occurred', {
      errorType,
      errorMessage,
      context,
      timestamp: new Date().toISOString()
    });
  }

  trackTimeOnPage(page, timeSpent) {
    return this.trackEvent('time_on_page', {
      page,
      timeSpent, // en segundos
      timestamp: new Date().toISOString()
    });
  }

  // Métodos para métricas de engagement
  trackEngagement(action, duration = null) {
    return this.trackEvent('engagement', {
      action,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  // Método para limpiar datos del usuario (GDPR compliance)
  clearUserData() {
    localStorage.removeItem('edutechlife_user_id');
    localStorage.removeItem(this.localStorageKey);
    this.userId = this.generateSessionId(); // Generar nuevo ID anónimo
    this.queue = [];
  }

  // Método para obtener métricas resumidas
  getMetrics() {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      queueLength: this.queue.length,
      totalEvents: this.queue.length
    };
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();