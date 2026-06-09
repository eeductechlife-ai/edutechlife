import * as esData from './practicalCases.es.js';
import * as enData from './practicalCases.en.js';

const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? enData : esData;

export const { challenges } = data;
