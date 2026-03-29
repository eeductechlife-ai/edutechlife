// Servicio de Analytics y Optimización para EdutechLife

class AnalyticsService {
  constructor() {
    this.STORAGE_KEY = 'edutechlife_analytics';
    this.AB_TESTING_KEY = 'edutechlife_ab_tests';
    this.initialized = false;
    this.metrics = this.loadMetrics();
    this.abTests = this.loadABTests();
    this.sessionStartTime = null;
    this.currentSessionId = null;
  }

  // Cargar métricas desde localStorage
  loadMetrics() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading analytics:', e);
    }

    // Métricas iniciales
    return {
      // Sesiones y engagement
      totalSessions: 0,
      totalMessages: 0,
      avgSessionDuration: 0,
      avgMessagesPerSession: 0,
      
      // Conversión de leads
      totalLeads: 0,
      leadsBySource: {
        nico_chat: 0,
        website_form: 0,
        referral: 0
      },
      leadConversionRate: 0,
      avgTimeToLead: 0, // en segundos
      
      // Conversión de citas
      totalAppointments: 0,
      appointmentsScheduled: 0,
      appointmentsCompleted: 0,
      appointmentsCancelled: 0,
      appointmentConversionRate: 0, // leads → citas
      completionRate: 0, // citas agendadas → completadas
      
      // Engagement por interés
      engagementByInterest: {
        programacion: { leads: 0, appointments: 0, messages: 0 },
        robotica: { leads: 0, appointments: 0, messages: 0 },
        vak: { leads: 0, appointments: 0, messages: 0 },
        tutoria: { leads: 0, appointments: 0, messages: 0 },
        bienestar: { leads: 0, appointments: 0, messages: 0 },
        general: { leads: 0, appointments: 0, messages: 0 }
      },
      
      // Tiempos de respuesta
      avgResponseTime: 0, // tiempo de Nico para responder
      responseTimeByComplexity: {
        simple: 0,
        medium: 0,
        complex: 0
      },
      
      // Efectividad de prompts
      promptEffectiveness: {
        lead_capture: { attempts: 0, successes: 0, rate: 0 },
        appointment_scheduling: { attempts: 0, successes: 0, rate: 0 },
        information_provided: { attempts: 0, successes: 0, rate: 0 }
      },
      
      // Horarios pico
      peakHours: {},
      peakDays: {},
      
      // Fallos y errores
      errors: {
        api_errors: 0,
        voice_errors: 0,
        recognition_errors: 0,
        cache_misses: 0
      },
      
      // Historial detallado
      sessionHistory: [],
      leadHistory: [],
      appointmentHistory: [],
      messageHistory: [],
      
      // Timestamps
      firstInteraction: null,
      lastInteraction: null,
      lastUpdated: null
    };
  }

  // Cargar tests A/B desde localStorage
  loadABTests() {
    try {
      const saved = localStorage.getItem(this.AB_TESTING_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading AB tests:', e);
    }

    // Tests A/B iniciales
    return {
      activeTests: {},
      testHistory: [],
      variants: {
        // Variantes de prompt para testing
        greeting_variants: [
          {
            id: 'greeting_v1',
            content: '¡Hola! Soy NICO, tu agente de EdutechLife. ¿Me podrías decir tu nombre para dirigirme a ti correctamente?',
            weight: 0.5,
            stats: { sessions: 0, leads: 0, conversion: 0 }
          },
          {
            id: 'greeting_v2',
            content: '¡Buenos días! Soy NICO de EdutechLife. Para personalizar nuestra conversación, ¿cuál es tu nombre?',
            weight: 0.5,
            stats: { sessions: 0, leads: 0, conversion: 0 }
          }
        ],
        
        // Variantes de solicitud de lead
        lead_capture_variants: [
          {
            id: 'lead_capture_v1',
            content: 'Para poder personalizar mejor la información, ¿me podrías compartir tu número de teléfono?',
            weight: 0.33,
            stats: { attempts: 0, successes: 0, rate: 0 }
          },
          {
            id: 'lead_capture_v2',
            content: 'Perfecto, me encantaría que un especialista te contacte. ¿Cuál es tu nombre completo y un número donde te podamos localizar?',
            weight: 0.33,
            stats: { attempts: 0, successes: 0, rate: 0 }
          },
          {
            id: 'lead_capture_v3',
            content: 'Excelente, para agendar tu clase gratuita necesito algunos datos. ¿Me podrías decir tu nombre completo y tu número de WhatsApp?',
            weight: 0.34,
            stats: { attempts: 0, successes: 0, rate: 0 }
          }
        ],
        
        // Variantes de pregunta de agendamiento
        appointment_prompt_variants: [
          {
            id: 'appointment_v1',
            content: '¿Te gustaría agendar una llamada gratuita con uno de nuestros especialistas?',
            weight: 0.5,
            stats: { asks: 0, accepts: 0, rate: 0 }
          },
          {
            id: 'appointment_v2',
            content: '¿Quieres que coordine una cita con un experto para profundizar en esto?',
            weight: 0.5,
            stats: { asks: 0, accepts: 0, rate: 0 }
          }
        ]
      }
    };
  }

  // Inicializar servicio
  initialize() {
    if (this.initialized) return true;

    try {
      this.sessionStartTime = Date.now();
      this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Registrar nueva sesión
      this.recordSessionStart();
      
      this.initialized = true;
      console.log('📊 Analytics service initialized');
      return true;

    } catch (error) {
      console.error('Error initializing analytics:', error);
      return false;
    }
  }

  // Guardar métricas
  saveMetrics() {
    try {
      this.metrics.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.metrics));
    } catch (e) {
      console.error('Error saving analytics:', e);
    }
  }

  // Guardar tests A/B
  saveABTests() {
    try {
      localStorage.setItem(this.AB_TESTING_KEY, JSON.stringify(this.abTests));
    } catch (e) {
      console.error('Error saving AB tests:', e);
    }
  }

  // ========== TRACKING DE SESIONES ==========

  // Registrar inicio de sesión
  recordSessionStart() {
    this.metrics.totalSessions++;
    
    const sessionRecord = {
      id: this.currentSessionId,
      startTime: new Date().toISOString(),
      startTimestamp: Date.now(),
      messages: 0,
      leads: 0,
      appointments: 0,
      duration: 0,
      interests: [],
      completed: false
    };
    
    this.metrics.sessionHistory.unshift(sessionRecord);
    
    // Mantener solo las últimas 100 sesiones
    if (this.metrics.sessionHistory.length > 100) {
      this.metrics.sessionHistory = this.metrics.sessionHistory.slice(0, 100);
    }
    
    this.saveMetrics();
  }

  // Registrar fin de sesión
  recordSessionEnd() {
    if (!this.currentSessionId) return;

    const session = this.metrics.sessionHistory.find(s => s.id === this.currentSessionId);
    if (session) {
      session.endTime = new Date().toISOString();
      session.duration = Date.now() - session.startTimestamp;
      session.completed = true;
      
      // Actualizar promedio de duración de sesión
      const completedSessions = this.metrics.sessionHistory.filter(s => s.completed);
      if (completedSessions.length > 0) {
        const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
        this.metrics.avgSessionDuration = totalDuration / completedSessions.length;
      }
      
      this.saveMetrics();
    }
    
    this.currentSessionId = null;
    this.sessionStartTime = null;
  }

  // Registrar mensaje
  recordMessage(role, content, responseTime = null) {
    if (!this.currentSessionId) return;

    this.metrics.totalMessages++;
    
    const session = this.metrics.sessionHistory.find(s => s.id === this.currentSessionId);
    if (session) {
      session.messages = (session.messages || 0) + 1;
    }
    
    // Actualizar promedio de mensajes por sesión
    const activeSessions = this.metrics.sessionHistory.filter(s => !s.completed);
    if (activeSessions.length > 0) {
      const totalMessages = activeSessions.reduce((sum, s) => sum + (s.messages || 0), 0);
      this.metrics.avgMessagesPerSession = totalMessages / activeSessions.length;
    }
    
    // Registrar en historial de mensajes
    const messageRecord = {
      sessionId: this.currentSessionId,
      role,
      content: content.substring(0, 200), // Limitar longitud
      timestamp: new Date().toISOString(),
      responseTime
    };
    
    this.metrics.messageHistory.unshift(messageRecord);
    
    // Mantener solo los últimos 500 mensajes
    if (this.metrics.messageHistory.length > 500) {
      this.metrics.messageHistory = this.metrics.messageHistory.slice(0, 500);
    }
    
    // Actualizar tiempo de respuesta promedio
    if (responseTime && role === 'assistant') {
      const assistantMessages = this.metrics.messageHistory.filter(m => m.role === 'assistant' && m.responseTime);
      if (assistantMessages.length > 0) {
        const totalResponseTime = assistantMessages.reduce((sum, m) => sum + m.responseTime, 0);
        this.metrics.avgResponseTime = totalResponseTime / assistantMessages.length;
      }
    }
    
    this.saveMetrics();
  }

  // ========== TRACKING DE LEADS ==========

  // Registrar nuevo lead
  recordLead(leadData, source = 'nico_chat', timeToLead = null) {
    this.metrics.totalLeads++;
    this.metrics.leadsBySource[source] = (this.metrics.leadsBySource[source] || 0) + 1;
    
    // Actualizar tasa de conversión (sesiones → leads)
    if (this.metrics.totalSessions > 0) {
      this.metrics.leadConversionRate = (this.metrics.totalLeads / this.metrics.totalSessions) * 100;
    }
    
    // Actualizar tiempo promedio para lead
    if (timeToLead) {
      const leadHistory = this.metrics.leadHistory.filter(l => l.timeToLead);
      const totalTime = leadHistory.reduce((sum, l) => sum + l.timeToLead, timeToLead);
      this.metrics.avgTimeToLead = totalTime / (leadHistory.length + 1);
    }
    
    // Actualizar engagement por interés
    const interest = leadData.interesPrincipal || 'general';
    if (this.metrics.engagementByInterest[interest]) {
      this.metrics.engagementByInterest[interest].leads++;
    }
    
    // Registrar en sesión actual
    const session = this.metrics.sessionHistory.find(s => s.id === this.currentSessionId);
    if (session) {
      session.leads = (session.leads || 0) + 1;
      if (interest && !session.interests.includes(interest)) {
        session.interests.push(interest);
      }
    }
    
    // Registrar en historial
    const leadRecord = {
      id: leadData.id || `lead_${Date.now()}`,
      sessionId: this.currentSessionId,
      source,
      interest,
      timestamp: new Date().toISOString(),
      timeToLead,
      data: {
        nombre: leadData.nombreCompleto?.substring(0, 50),
        hasEmail: !!leadData.email,
        hasPhone: !!leadData.telefono
      }
    };
    
    this.metrics.leadHistory.unshift(leadRecord);
    
    // Mantener solo los últimos 200 leads
    if (this.metrics.leadHistory.length > 200) {
      this.metrics.leadHistory = this.metrics.leadHistory.slice(0, 200);
    }
    
    // Actualizar timestamps
    if (!this.metrics.firstInteraction) {
      this.metrics.firstInteraction = new Date().toISOString();
    }
    this.metrics.lastInteraction = new Date().toISOString();
    
    this.saveMetrics();
  }

  // ========== TRACKING DE CITAS ==========

  // Registrar nueva cita
  recordAppointment(appointmentData, source = 'nico_chat') {
    this.metrics.totalAppointments++;
    this.metrics.appointmentsScheduled++;
    
    // Actualizar tasa de conversión (leads → citas)
    if (this.metrics.totalLeads > 0) {
      this.metrics.appointmentConversionRate = (this.metrics.totalAppointments / this.metrics.totalLeads) * 100;
    }
    
    // Actualizar engagement por interés
    const interest = appointmentData.topic || 'general';
    if (this.metrics.engagementByInterest[interest]) {
      this.metrics.engagementByInterest[interest].appointments++;
    }
    
    // Registrar en sesión actual
    const session = this.metrics.sessionHistory.find(s => s.id === this.currentSessionId);
    if (session) {
      session.appointments = (session.appointments || 0) + 1;
    }
    
    // Registrar en historial
    const appointmentRecord = {
      id: appointmentData.id,
      sessionId: this.currentSessionId,
      source,
      interest,
      status: 'scheduled',
      timestamp: new Date().toISOString(),
      scheduledFor: appointmentData.date,
      data: {
        modality: appointmentData.modality,
        duration: appointmentData.duration,
        leadName: appointmentData.leadName?.substring(0, 50)
      }
    };
    
    this.metrics.appointmentHistory.unshift(appointmentRecord);
    
    // Mantener solo las últimas 100 citas
    if (this.metrics.appointmentHistory.length > 100) {
      this.metrics.appointmentHistory = this.metrics.appointmentHistory.slice(0, 100);
    }
    
    this.saveMetrics();
  }

  // Actualizar estado de cita
  updateAppointmentStatus(appointmentId, newStatus, notes = '') {
    const appointment = this.metrics.appointmentHistory.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = newStatus;
      appointment.updatedAt = new Date().toISOString();
      appointment.notes = notes;
      
      // Actualizar contadores
      if (newStatus === 'completed') {
        this.metrics.appointmentsCompleted++;
        this.metrics.appointmentsScheduled--;
      } else if (newStatus === 'cancelled') {
        this.metrics.appointmentsCancelled++;
        this.metrics.appointmentsScheduled--;
      }
      
      // Actualizar tasa de completación
      if (this.metrics.totalAppointments > 0) {
        this.metrics.completionRate = (this.metrics.appointmentsCompleted / this.metrics.totalAppointments) * 100;
      }
      
      this.saveMetrics();
    }
  }

  // ========== A/B TESTING ==========

  // Seleccionar variante para test A/B
  getVariant(testName) {
    const variants = this.abTests.variants[testName];
    if (!variants || variants.length === 0) {
      return null;
    }
    
    // Selección basada en peso
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const variant of variants) {
      if (random < variant.weight) {
        return variant;
      }
      random -= variant.weight;
    }
    
    return variants[0];
  }

  // Registrar intento de test
  recordTestAttempt(testName, variantId, success = false) {
    const variants = this.abTests.variants[testName];
    if (!variants) return;
    
    const variant = variants.find(v => v.id === variantId);
    if (variant) {
      variant.stats.attempts = (variant.stats.attempts || 0) + 1;
      if (success) {
        variant.stats.successes = (variant.stats.successes || 0) + 1;
      }
      
      // Calcular tasa de éxito
      if (variant.stats.attempts > 0) {
        variant.stats.rate = (variant.stats.successes / variant.stats.attempts) * 100;
      }
      
      // Registrar en historial de tests
      this.abTests.testHistory.unshift({
        testName,
        variantId,
        success,
        timestamp: new Date().toISOString()
      });
      
      // Mantener solo los últimos 500 tests
      if (this.abTests.testHistory.length > 500) {
        this.abTests.testHistory = this.abTests.testHistory.slice(0, 500);
      }
      
      this.saveABTests();
    }
  }

  // Optimizar pesos basado en performance
  optimizeTestWeights(testName) {
    const variants = this.abTests.variants[testName];
    if (!variants || variants.length < 2) return;
    
    // Calcular nuevo peso basado en tasa de éxito
    const totalRate = variants.reduce((sum, v) => sum + (v.stats.rate || 0), 0);
    
    if (totalRate > 0) {
      variants.forEach(variant => {
        // Asignar peso proporcional a la tasa de éxito
        variant.weight = (variant.stats.rate || 0) / totalRate;
        
        // Mínimo 10% de peso para seguir probando
        if (variant.weight < 0.1) {
          variant.weight = 0.1;
        }
      });
      
      // Normalizar para que sumen 1
      const newTotalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
      variants.forEach(variant => {
        variant.weight = variant.weight / newTotalWeight;
      });
      
      this.saveABTests();
    }
  }

  // ========== ANÁLISIS Y REPORTES ==========

  // Obtener métricas por rango de tiempo
  getMetrics(timeRange = 'today') {
    const now = new Date();
    let startDate;
    
    switch(timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'all':
      default:
        startDate = new Date(0); // Desde el inicio
    }
    
    // Filtrar datos por fecha
    const filteredSessions = this.metrics.sessionHistory.filter(session => 
      new Date(session.startTime) >= startDate
    );
    
    const filteredLeads = this.metrics.leadHistory.filter(lead =>
      new Date(lead.timestamp) >= startDate
    );
    
    const filteredAppointments = this.metrics.appointmentHistory.filter(appt =>
      new Date(appt.timestamp) >= startDate
    );
    
    // Calcular métricas filtradas
    const totalSessions = filteredSessions.length;
    const totalLeads = filteredLeads.length;
    const totalAppointments = filteredAppointments.length;
    const completedAppointments = filteredAppointments.filter(appt => appt.status === 'completed').length;
    
    return {
      conversations: {
        total: totalSessions,
        active: filteredSessions.filter(s => !s.completed).length,
        avgDuration: filteredSessions.length > 0 
          ? Math.round(filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / filteredSessions.length / 1000)
          : 0
      },
      leads: {
        total: totalLeads,
        conversionRate: totalSessions > 0 ? totalLeads / totalSessions : 0,
        qualityScore: totalLeads > 0 ? Math.min(totalLeads / (totalSessions || 1) * 100, 100) : 0
      },
      appointments: {
        total: totalAppointments,
        scheduled: filteredAppointments.filter(appt => appt.status === 'scheduled').length,
        completed: completedAppointments,
        conversionRate: totalLeads > 0 ? totalAppointments / totalLeads : 0,
        completionRate: totalAppointments > 0 ? completedAppointments / totalAppointments : 0
      },
      engagement: {
        rate: totalSessions > 0 ? Math.min(totalSessions / 100, 1) : 0, // Simulado
        messagesPerSession: totalSessions > 0 
          ? Math.round(filteredSessions.reduce((sum, s) => sum + (s.messages || 0), 0) / totalSessions)
          : 0,
        retention: totalSessions > 0 ? Math.min(totalSessions / 50, 1) : 0 // Simulado
      },
      trends: {
        conversations: this.generateHourlyTrends(filteredSessions, 'startTime'),
        leads: this.generateHourlyTrends(filteredLeads, 'timestamp'),
        appointments: this.generateHourlyTrends(filteredAppointments, 'timestamp')
      },
      sources: this.getLeadSources(filteredLeads),
      realtime: {
        activeSessions: filteredSessions.filter(s => !s.completed).length,
        leadsToday: filteredLeads.filter(l => 
          new Date(l.timestamp).toDateString() === now.toDateString()
        ).length,
        appointmentsToday: filteredAppointments.filter(a =>
          new Date(a.timestamp).toDateString() === now.toDateString()
        ).length,
        activity: this.getRecentActivity()
      }
    };
  }

  // Generar tendencias por hora
  generateHourlyTrends(data, dateField) {
    const hourlyData = Array(24).fill(0).map((_, hour) => ({
      hour,
      label: `${hour}:00`,
      value: 0
    }));
    
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const hour = date.getHours();
      if (hourlyData[hour]) {
        hourlyData[hour].value++;
      }
    });
    
    return hourlyData;
  }

  // Obtener fuentes de leads
  getLeadSources(leads) {
    const sources = {};
    
    leads.forEach(lead => {
      const source = lead.source || 'nico_chat';
      sources[source] = (sources[source] || 0) + 1;
    });
    
    const total = Object.values(sources).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(sources).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  }

  // Obtener actividad reciente
  getRecentActivity() {
    const now = new Date();
    const activities = [];
    
    // Últimas sesiones
    this.metrics.sessionHistory.slice(0, 5).forEach(session => {
      const time = new Date(session.startTime);
      const minutesAgo = Math.round((now - time) / (1000 * 60));
      
      activities.push({
        time: `${minutesAgo} min`,
        type: 'Sesión iniciada',
        details: `${session.messages || 0} mensajes`
      });
    });
    
    // Últimos leads
    this.metrics.leadHistory.slice(0, 5).forEach(lead => {
      const time = new Date(lead.timestamp);
      const minutesAgo = Math.round((now - time) / (1000 * 60));
      
      activities.push({
        time: `${minutesAgo} min`,
        type: 'Lead capturado',
        details: lead.nombreCompleto?.substring(0, 20) || 'Nuevo lead'
      });
    });
    
    // Últimas citas
    this.metrics.appointmentHistory.slice(0, 5).forEach(appt => {
      const time = new Date(appt.timestamp);
      const minutesAgo = Math.round((now - time) / (1000 * 60));
      
      activities.push({
        time: `${minutesAgo} min`,
        type: 'Cita agendada',
        details: appt.data?.leadName?.substring(0, 20) || 'Nueva cita'
      });
    });
    
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);
  }

  // Obtener métricas resumidas
  getSummaryMetrics() {
    return {
      // Engagement
      totalSessions: this.metrics.totalSessions,
      totalMessages: this.metrics.totalMessages,
      avgSessionDuration: Math.round(this.metrics.avgSessionDuration / 1000), // en segundos
      avgMessagesPerSession: Math.round(this.metrics.avgMessagesPerSession * 10) / 10,
      
      // Conversión
      totalLeads: this.metrics.totalLeads,
      leadConversionRate: Math.round(this.metrics.leadConversionRate * 10) / 10,
      totalAppointments: this.metrics.totalAppointments,
      appointmentConversionRate: Math.round(this.metrics.appointmentConversionRate * 10) / 10,
      completionRate: Math.round(this.metrics.completionRate * 10) / 10,
      
      // Performance
      avgResponseTime: Math.round(this.metrics.avgResponseTime),
      avgTimeToLead: Math.round(this.metrics.avgTimeToLead),
      
      // Intereses principales
      topInterests: this.getTopInterests(3),
      
      // Última actualización
      lastUpdated: this.metrics.lastUpdated
    };
  }

  // Obtener intereses más populares
  getTopInterests(limit = 5) {
    const interests = Object.entries(this.metrics.engagementByInterest)
      .map(([interest, data]) => ({
        interest,
        leads: data.leads,
        appointments: data.appointments,
        messages: data.messages,
        totalScore: data.leads * 3 + data.appointments * 2 + data.messages // Ponderación
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
    
    return interests;
  }

  // Obtener horarios pico
  getPeakHours() {
    const hourCounts = {};
    
    this.metrics.sessionHistory.forEach(session => {
      if (session.startTime) {
        const hour = new Date(session.startTime).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    
    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count);
  }

  // Obtener efectividad de prompts
  getPromptEffectiveness() {
    return this.metrics.promptEffectiveness;
  }

  // Obtener tests A/B activos
  getActiveTests() {
    const tests = [];
    
    Object.entries(this.abTests.variants).forEach(([testName, variants]) => {
      const totalAttempts = variants.reduce((sum, v) => sum + (v.stats.attempts || 0), 0);
      
      if (totalAttempts > 0) {
        const bestVariant = [...variants].sort((a, b) => (b.stats.rate || 0) - (a.stats.rate || 0))[0];
        
        tests.push({
          name: testName,
          variants: variants.length,
          totalAttempts,
          bestVariant: bestVariant.id,
          bestRate: Math.round(bestVariant.stats.rate || 0),
          weights: variants.map(v => ({ id: v.id, weight: Math.round(v.weight * 100) }))
        });
      }
    });
    
    return tests;
  }

  // Generar reporte CSV
  generateCSVReport(type = 'summary') {
    let csv = '';
    
    switch (type) {
      case 'sessions':
        csv = 'ID,Fecha Inicio,Duración (ms),Mensajes,Leads,Citas,Intereses\n';
        this.metrics.sessionHistory.forEach(session => {
          csv += `${session.id},${session.startTime},${session.duration},${session.messages},${session.leads},${session.appointments},"${session.interests.join(', ')}"\n`;
        });
        break;
        
      case 'leads':
        csv = 'ID,Sesión,Fuente,Interés,Fecha,Tiempo a Lead (ms)\n';
        this.metrics.leadHistory.forEach(lead => {
          csv += `${lead.id},${lead.sessionId},${lead.source},${lead.interest},${lead.timestamp},${lead.timeToLead || ''}\n`;
        });
        break;
        
      case 'appointments':
        csv = 'ID,Sesión,Estado,Interés,Fecha Agendada,Fecha Creación,Modalidad,Duración\n';
        this.metrics.appointmentHistory.forEach(appt => {
          csv += `${appt.id},${appt.sessionId},${appt.status},${appt.interest},${appt.scheduledFor},${appt.timestamp},${appt.data.modality},${appt.data.duration}\n`;
        });
        break;
        
      case 'ab_tests':
        csv = 'Nombre Test,Variante,Intentos,Éxitos,Tasa Éxito %,Peso %\n';
        Object.entries(this.abTests.variants).forEach(([testName, variants]) => {
          variants.forEach(variant => {
            csv += `${testName},${variant.id},${variant.stats.attempts || 0},${variant.stats.successes || 0},${Math.round(variant.stats.rate || 0)},${Math.round(variant.weight * 100)}\n`;
          });
        });
        break;
        
      default: // summary
        const summary = this.getSummaryMetrics();
        csv = 'Métrica,Valor\n';
        Object.entries(summary).forEach(([key, value]) => {
          if (typeof value !== 'object') {
            csv += `${key},${value}\n`;
          }
        });
    }
    
    return csv;
  }

  // Exportar reporte
  exportReport(type = 'summary') {
    const csv = this.generateCSVReport(type);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `edutechlife_analytics_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // Alias para exportData (compatibilidad con dashboard)
  exportData(format = 'csv') {
    this.exportReport('summary');
  }

  // ======================
  // ALGORITMOS DE OPTIMIZACIÓN
  // ======================

  // Analizar patrones de conversación exitosos
  analyzeSuccessfulConversations() {
    const successfulConversations = this.metrics.conversationHistory.filter(conv => 
      conv.leadCaptured || conv.appointmentScheduled
    );
    
    if (successfulConversations.length === 0) {
      return {
        patterns: [],
        avgMessagesToLead: 0,
        avgMessagesToAppointment: 0
      };
    }

    // Analizar patrones comunes
    const patterns = {
      greetingStyles: {},
      questionTypes: {},
      responseTimes: [],
      messageLengths: []
    };

    successfulConversations.forEach(conv => {
      // Analizar estilo de saludo
      const firstMessage = conv.messages[0]?.content?.toLowerCase() || '';
      if (firstMessage.includes('buenos días')) patterns.greetingStyles.morning = (patterns.greetingStyles.morning || 0) + 1;
      if (firstMessage.includes('buenas tardes')) patterns.greetingStyles.afternoon = (patterns.greetingStyles.afternoon || 0) + 1;
      if (firstMessage.includes('buenas noches')) patterns.greetingStyles.evening = (patterns.greetingStyles.evening || 0) + 1;
      if (firstMessage.includes('hola')) patterns.greetingStyles.hola = (patterns.greetingStyles.hola || 0) + 1;

      // Analizar tipos de preguntas
      conv.messages.forEach(msg => {
        if (msg.role === 'user') {
          const content = msg.content.toLowerCase();
          if (content.includes('precio') || content.includes('costo')) patterns.questionTypes.price = (patterns.questionTypes.price || 0) + 1;
          if (content.includes('horario') || content.includes('horas')) patterns.questionTypes.schedule = (patterns.questionTypes.schedule || 0) + 1;
          if (content.includes('programa') || content.includes('curso')) patterns.questionTypes.program = (patterns.questionTypes.program || 0) + 1;
          if (content.includes('edad') || content.includes('años')) patterns.questionTypes.age = (patterns.questionTypes.age || 0) + 1;
        }
      });

      // Calcular tiempos de respuesta promedio
      let totalResponseTime = 0;
      let responseCount = 0;
      
      for (let i = 1; i < conv.messages.length; i++) {
        if (conv.messages[i].role === 'assistant' && conv.messages[i-1].role === 'user') {
          const responseTime = new Date(conv.messages[i].timestamp) - new Date(conv.messages[i-1].timestamp);
          if (responseTime > 0) {
            patterns.responseTimes.push(responseTime);
            totalResponseTime += responseTime;
            responseCount++;
          }
        }
      }

      // Longitudes de mensajes
      conv.messages.forEach(msg => {
        patterns.messageLengths.push(msg.content.length);
      });
    });

    // Calcular promedios
    const avgMessagesToLead = successfulConversations
      .filter(conv => conv.leadCaptured)
      .reduce((sum, conv) => sum + conv.messageCount, 0) / 
      Math.max(successfulConversations.filter(conv => conv.leadCaptured).length, 1);

    const avgMessagesToAppointment = successfulConversations
      .filter(conv => conv.appointmentScheduled)
      .reduce((sum, conv) => sum + conv.messageCount, 0) / 
      Math.max(successfulConversations.filter(conv => conv.appointmentScheduled).length, 1);

    return {
      patterns,
      avgMessagesToLead: Math.round(avgMessagesToLead),
      avgMessagesToAppointment: Math.round(avgMessagesToAppointment),
      sampleSize: successfulConversations.length
    };
  }

  // Sugerencias de optimización basadas en datos
  getOptimizationSuggestions() {
    const suggestions = [];
    const metrics = this.getMetrics('week');
    const patterns = this.analyzeSuccessfulConversations();

    // 1. Sugerencia basada en tasa de conversión de leads
    if (metrics.leads.conversionRate < 0.3) {
      suggestions.push({
        title: 'Mejorar tasa de conversión de leads',
        description: 'La tasa de conversión actual es baja. Considera ajustar el momento de solicitar información o mejorar las preguntas de calificación.',
        priority: 'high',
        expectedImpact: '+15-25% conversión',
        confidence: 0.8,
        action: 'Ajustar umbral de captura de leads en useLeadCaptureLogic'
      });
    }

    // 2. Sugerencia basada en tiempo promedio para captura
    if (patterns.avgMessagesToLead > 8) {
      suggestions.push({
        title: 'Reducir tiempo para captura de leads',
        description: `Actualmente se requieren ${patterns.avgMessagesToLead} mensajes en promedio para capturar un lead. Considera ser más directo después de identificar interés.`,
        priority: 'medium',
        expectedImpact: '-30% tiempo de conversación',
        confidence: 0.7,
        action: 'Reducir minMessagesBeforeAsk en useLeadCaptureLogic'
      });
    }

    // 3. Sugerencia basada en patrones de saludo
    const totalGreetings = Object.values(patterns.patterns.greetingStyles || {}).reduce((a, b) => a + b, 0);
    if (totalGreetings > 0) {
      const mostEffectiveGreeting = Object.entries(patterns.patterns.greetingStyles || {})
        .sort((a, b) => b[1] - a[1])[0];
      
      if (mostEffectiveGreeting) {
        suggestions.push({
          title: 'Optimizar saludo inicial',
          description: `El saludo "${mostEffectiveGreeting[0]}" tiene la mayor tasa de éxito. Considera enfatizar este estilo en el prompt.`,
          priority: 'low',
          expectedImpact: '+5-10% engagement inicial',
          confidence: 0.6,
          action: 'Ajustar getGreeting() en NicoModern.jsx'
        });
      }
    }

    // 4. Sugerencia basada en tasa de conversión a citas
    if (metrics.appointments.conversionRate < 0.2) {
      suggestions.push({
        title: 'Mejorar conversión de leads a citas',
        description: 'Solo el 20% de los leads se convierten en citas. Considera mejorar el momento de ofrecer agendamiento o el mensaje de valor.',
        priority: 'high',
        expectedImpact: '+20-30% citas agendadas',
        confidence: 0.75,
        action: 'Optimizar flujo de agendamiento en AppointmentScheduler'
      });
    }

    // 5. Sugerencia basada en tiempo de respuesta
    if (patterns.patterns.responseTimes && patterns.patterns.responseTimes.length > 0) {
      const avgResponseTime = patterns.patterns.responseTimes.reduce((a, b) => a + b, 0) / patterns.patterns.responseTimes.length;
      if (avgResponseTime > 5000) { // Más de 5 segundos
        suggestions.push({
          title: 'Optimizar tiempo de respuesta',
          description: `El tiempo promedio de respuesta es ${Math.round(avgResponseTime/1000)}s. Considera implementar caché más agresivo o respuestas predefinidas.`,
          priority: 'medium',
          expectedImpact: '-40% tiempo de espera',
          confidence: 0.65,
          action: 'Mejorar sistema de caché en NicoModern.jsx'
        });
      }
    }

    // 6. Sugerencia basada en tasa de finalización de citas
    if (metrics.appointments.completionRate < 0.7) {
      suggestions.push({
        title: 'Mejorar tasa de asistencia a citas',
        description: 'Solo el 70% de las citas agendadas se completan. Considera mejorar el sistema de recordatorios o confirmación previa.',
        priority: 'medium',
        expectedImpact: '+15-20% asistencia',
        confidence: 0.7,
        action: 'Mejorar sistema de recordatorios en notifications.js'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // Ejecutar optimización automática basada en sugerencias
  async runOptimization() {
    const suggestions = this.getOptimizationSuggestions();
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');
    
    if (highPrioritySuggestions.length === 0) {
      return {
        success: false,
        message: 'No hay sugerencias de alta prioridad para optimizar',
        suggestions: suggestions.length
      };
    }

    // Registrar la optimización
    this.metrics.optimizations = this.metrics.optimizations || [];
    this.metrics.optimizations.push({
      timestamp: new Date().toISOString(),
      suggestionsApplied: highPrioritySuggestions.map(s => s.title),
      totalSuggestions: suggestions.length
    });

    this.saveMetrics();

    // Aquí en un sistema real, se aplicarían los cambios automáticamente
    // Por ahora, solo registramos y devolvemos las sugerencias
    return {
      success: true,
      message: `Se identificaron ${highPrioritySuggestions.length} optimizaciones de alta prioridad`,
      suggestions: highPrioritySuggestions.map(s => ({
        title: s.title,
        action: s.action,
        expectedImpact: s.expectedImpact
      })),
      totalSuggestions: suggestions.length
    };
  }

  // Obtener resultados de A/B testing para optimización
  getABTestResults() {
    const results = [];
    
    Object.entries(this.abTests.variants).forEach(([testName, variants]) => {
      const test = this.abTests.tests[testName];
      if (!test) return;

      // Calcular tasa de éxito para cada variante
      const variantResults = variants.map(variant => ({
        name: variant.id,
        conversionRate: variant.stats.rate || 0,
        samples: variant.stats.attempts || 0,
        successes: variant.stats.successes || 0
      }));

      // Determinar ganador (si hay suficientes muestras)
      const validVariants = variantResults.filter(v => v.samples >= 10);
      let winner = null;
      
      if (validVariants.length >= 2) {
        validVariants.sort((a, b) => b.conversionRate - a.conversionRate);
        if (validVariants[0].conversionRate > validVariants[1].conversionRate * 1.1) {
          winner = validVariants[0].name;
        }
      }

      results.push({
        name: testName,
        description: test.description,
        variants: variantResults,
        winner,
        totalSamples: variantResults.reduce((sum, v) => sum + v.samples, 0)
      });
    });

    return results;
  }

  // Limpiar datos (para testing)
  clearData() {
    this.metrics = this.loadMetrics();
    this.abTests = this.loadABTests();
    this.saveMetrics();
    this.saveABTests();
    console.log('📊 Analytics data cleared');
  }

  // Obtener estado del servicio
  getStatus() {
    return {
      initialized: this.initialized,
      currentSessionId: this.currentSessionId,
      totalSessions: this.metrics.totalSessions,
      totalLeads: this.metrics.totalLeads,
      totalAppointments: this.metrics.totalAppointments,
      lastUpdated: this.metrics.lastUpdated
    };
  }
}

// Instancia singleton
const analyticsService = new AnalyticsService();

export default analyticsService;