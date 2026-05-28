const locale = typeof window !== 'undefined'
  ? (typeof localStorage !== 'undefined' ? (localStorage.getItem('edutechlife_locale') || 'es') : 'es')
  : 'es';

const prompts = locale === 'en'
  ? require('./prompts.en.js')
  : require('./prompts.es.js');

export const PROMPT_VALERIO_DOCENTE = prompts.PROMPT_VALERIO_DOCENTE;
export const PROMPT_PSICOLOGO_VAK = prompts.PROMPT_PSICOLOGO_VAK;
export const PROMPT_DANI_EXPERTO = prompts.PROMPT_DANI_EXPERTO;
export const PROMPT_EXPERTO_PSICOPEDAGOGO = prompts.PROMPT_EXPERTO_PSICOPEDAGOGO;
export const PROMPT_ANALIZAR_DOCUMENTO = prompts.PROMPT_ANALIZAR_DOCUMENTO;
export const PROMPT_TUTOR_TAREAS = prompts.PROMPT_TUTOR_TAREAS;
export const PROMPT_DEFAULT_COACH = prompts.PROMPT_DEFAULT_COACH;
export const PROMPT_NICO_SOPORTE = prompts.PROMPT_NICO_SOPORTE;
export const PROMPT_VALENTINA_PSICOLOGA = prompts.PROMPT_VALENTINA_PSICOLOGA;
