import * as esData from './ethicalDilemmas.es.js';
import * as enData from './ethicalDilemmas.en.js';

const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? enData : esData;

export const { dilemmas, accordionData } = data;
