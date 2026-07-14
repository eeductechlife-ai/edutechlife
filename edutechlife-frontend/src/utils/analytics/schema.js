export const defaultMetrics = {
  totalSessions: 0,
  totalMessages: 0,
  avgSessionDuration: 0,
  avgMessagesPerSession: 0,

  totalLeads: 0,
  leadsBySource: {
    nico_chat: 0,
    website_form: 0,
    referral: 0,
  },
  leadConversionRate: 0,
  avgTimeToLead: 0,

  totalAppointments: 0,
  appointmentsScheduled: 0,
  appointmentsCompleted: 0,
  appointmentsCancelled: 0,
  appointmentConversionRate: 0,
  completionRate: 0,

  engagementByInterest: {
    programacion: { leads: 0, appointments: 0, messages: 0 },
    robotica: { leads: 0, appointments: 0, messages: 0 },
    vak: { leads: 0, appointments: 0, messages: 0 },
    tutoria: { leads: 0, appointments: 0, messages: 0 },
    bienestar: { leads: 0, appointments: 0, messages: 0 },
    general: { leads: 0, appointments: 0, messages: 0 },
  },

  avgResponseTime: 0,
  responseTimeByComplexity: {
    simple: 0,
    medium: 0,
    complex: 0,
  },

  promptEffectiveness: {
    lead_capture: { attempts: 0, successes: 0, rate: 0 },
    appointment_scheduling: { attempts: 0, successes: 0, rate: 0 },
    information_provided: { attempts: 0, successes: 0, rate: 0 },
  },

  peakHours: {},
  peakDays: {},

  errors: {
    api_errors: 0,
    voice_errors: 0,
    recognition_errors: 0,
    cache_misses: 0,
  },

  sessionHistory: [],
  leadHistory: [],
  appointmentHistory: [],
  messageHistory: [],

  firstInteraction: null,
  lastInteraction: null,
  lastUpdated: null,
};

export const defaultABTests = {
  activeTests: {},
  testHistory: [],
  variants: {
    greeting_variants: [
      {
        id: "greeting_v1",
        content:
          "¡Hola! Soy NICO, tu agente de EdutechLife. ¿Me podrías decir tu nombre para dirigirme a ti correctamente?",
        weight: 0.5,
        stats: { sessions: 0, leads: 0, conversion: 0 },
      },
      {
        id: "greeting_v2",
        content:
          "¡Buenos días! Soy NICO de EdutechLife. Para personalizar nuestra conversación, ¿cuál es tu nombre?",
        weight: 0.5,
        stats: { sessions: 0, leads: 0, conversion: 0 },
      },
    ],

    lead_capture_variants: [
      {
        id: "lead_capture_v1",
        content:
          "Para poder personalizar mejor la información, ¿me podrías compartir tu número de teléfono?",
        weight: 0.33,
        stats: { attempts: 0, successes: 0, rate: 0 },
      },
      {
        id: "lead_capture_v2",
        content:
          "Perfecto, me encantaría que un especialista te contacte. ¿Cuál es tu nombre completo y un número donde te podamos localizar?",
        weight: 0.33,
        stats: { attempts: 0, successes: 0, rate: 0 },
      },
      {
        id: "lead_capture_v3",
        content:
          "Excelente, para agendar tu clase gratuita necesito algunos datos. ¿Me podrías decir tu nombre completo y tu número de WhatsApp?",
        weight: 0.34,
        stats: { attempts: 0, successes: 0, rate: 0 },
      },
    ],

    appointment_prompt_variants: [
      {
        id: "appointment_v1",
        content:
          "¿Te gustaría agendar una llamada gratuita con uno de nuestros especialistas?",
        weight: 0.5,
        stats: { asks: 0, accepts: 0, rate: 0 },
      },
      {
        id: "appointment_v2",
        content:
          "¿Quieres que coordine una cita con un experto para profundizar en esto?",
        weight: 0.5,
        stats: { asks: 0, accepts: 0, rate: 0 },
      },
    ],
  },
};
