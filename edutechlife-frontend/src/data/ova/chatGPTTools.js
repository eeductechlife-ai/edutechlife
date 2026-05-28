import * as esData from './chatGPTTools.es.js';
import * as enData from './chatGPTTools.en.js';

const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? enData : esData;

export const { tools, quizScenarios } = data;
