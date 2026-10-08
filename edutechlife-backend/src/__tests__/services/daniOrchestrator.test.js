/**
 * B.13 — Verifica que el prompt de Dani se construye con TODOS los bloques de
 * contexto reales: profile, mastery, memory, plan, schedule.
 */
const { buildSystemPrompt } = require('../../services/daniOrchestrator');

describe('Dani orchestrator — buildSystemPrompt (B.13)', () => {
  const ctx = {
    profile: { grade_level: '6-7', age: 12, name: 'Ana', school: 'Colegio San José' },
    mastery: [
      { competency_id: 'co_matematicas_6-7_0', mastery_level: 0.3, updated_at: '2026-08-20T10:00:00Z' },
      { competency_id: 'co_matematicas_6-7_1', mastery_level: 0.2, updated_at: '2026-08-21T10:00:00Z' },
      { competency_id: 'co_lenguaje_6-7_0', mastery_level: 0.8, updated_at: '2026-08-22T10:00:00Z' },
    ],
    memory: {
      communicationStyle: 'shy',
      interests: ['astronomía', 'fútbol'],
      pendingTopics: ['fracciones', 'ecuaciones'],
      lastMood: 'frustrated',
    },
    activePlan: {
      type: 'daily',
      plan_json: { activities: [{ subject: 'matematicas', label: 'Ejercicios de fracciones' }] },
      generated_at: '2026-08-28T00:00:00Z',
    },
    todaySchedule: [
      { subject: 'matematicas', subject_label: 'Matemáticas', start_time: '07:00:00', end_time: '08:00:00', teacher: 'Sra. López' },
    ],
  };

  it('incluye el bloque PROFILE (nombre, grado, colegio)', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('Ana');
    expect(prompt).toContain('6-7');
    expect(prompt).toContain('Colegio San José');
  });

  it('incluye ÁREAS DE REFUERZO desde mastery_level (no mastery_score)', () => {
    const prompt = buildSystemPrompt(ctx);
    // matemáticas con mastery 0.3/0.2 < 0.5 → área de refuerzo
    expect(prompt).toContain('ÁREAS DE REFUERZO');
    expect(prompt).toContain('matematicas');
  });

  it('incluye ESTILO de comunicación desde memory.communicationStyle', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('reservado');
  });

  it('incluye INTERESES desde memory.interests', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('astronomía');
    expect(prompt).toContain('fútbol');
  });

  it('incluye TEMAS RECIENTES desde memory.pendingTopics', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('TEMAS RECIENTES');
    expect(prompt).toContain('fracciones');
  });

  it('incluye ESTADO EMOCIONAL desde memory.lastMood = frustrated', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('frustración');
  });

  it('incluye PLAN DE HOY desde plan_json (no plan_data)', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('PLAN DE HOY');
    expect(prompt).toContain('Ejercicios de fracciones');
  });

  it('incluye CLASES DE HOY desde timetable slots (subject_label)', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('CLASES DE HOY');
    expect(prompt).toContain('Matemáticas');
  });

  it('socraticMode agrega el addendum', () => {
    const prompt = buildSystemPrompt(ctx, { socraticMode: true });
    expect(prompt).toContain('MODO SOCRÁTICO');
  });

  it('incluye el contexto básico de EdutechLife/IngenIA (sin precio)', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('IngenIA');
    expect(prompt).toContain('IALab');
    expect(prompt).toContain('WhatsApp +57 323 836 5517');
  });

  it('PROHÍBE hablar de precios/monedas en el prompt de Dani', () => {
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain('NUNCA menciones precios');
    expect(prompt.toLowerCase()).toContain('dólares');
    // El prompt instruye a no citar cifras ni monedas.
    expect(prompt).toContain('NUNCA inventes montos');
  });

  describe('bienestar emocional', () => {
    it('ante tristeza o soledad pide invitar a hablar con un adulto de confianza', () => {
      const prompt = buildSystemPrompt(ctx);
      expect(prompt).toContain('BIENESTAR EMOCIONAL');
      expect(prompt).toContain('nadie me quiere');
      expect(prompt).toContain('¿Hay alguien de confianza');
      expect(prompt).toMatch(/mamá, papá, un familiar o un profesor/);
    });

    it('da prioridad a la persona sobre el tutorial paso a paso', () => {
      const prompt = buildSystemPrompt(ctx);
      expect(prompt).toMatch(/TIENE PRIORIDAD SOBRE EL TUTORIAL/);
      expect(prompt).toMatch(/la prioridad es la persona, no la tarea/);
    });

    it('si hay peligro remite al 123 y a un adulto, sin dar detalles de daño', () => {
      const prompt = buildSystemPrompt(ctx);
      expect(prompt).toContain('llame al 123');
      expect(prompt).toMatch(/No des detalles ni instrucciones sobre cómo hacerse daño/);
    });

    it('no inventa otras líneas de ayuda ni promete secreto', () => {
      const prompt = buildSystemPrompt(ctx);
      const section = prompt.slice(prompt.indexOf('## BIENESTAR EMOCIONAL'));
      const numbers = section.slice(0, 1200).match(/\b\d{3,}\b/g) || [];
      expect(numbers).toEqual(['123']);
      expect(prompt).toMatch(/Nunca digas que eres su única compañía ni le pidas guardar el secreto/);
    });

    it('está en el prompt de cualquier edad', () => {
      for (const age of [8, 12, 16]) {
        const p = buildSystemPrompt({ ...ctx, profile: { ...ctx.profile, age } });
        expect(p, `edad ${age}`).toContain('BIENESTAR EMOCIONAL');
      }
    });
  });
});
