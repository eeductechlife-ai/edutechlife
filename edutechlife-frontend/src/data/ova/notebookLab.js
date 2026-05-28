import * as esData from './notebookLab.es.js';
import * as enData from './notebookLab.en.js';

const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? enData : esData;

export const { contentScreens, questionsData } = data;
