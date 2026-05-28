import * as esData from './podcastStudio.es.js';
import * as enData from './podcastStudio.en.js';

const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? enData : esData;

export const { CONTENT_TYPES, GOALS, DOC_COUNTS, SOURCE_TIPS, GOAL_TIPS, DOC_TIPS, ESTIMATED_TIME, IDEAL_SOURCES, FORMATS, CHECKLIST_ITEMS } = data;
