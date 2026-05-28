import * as esData from './ecosystemGuide.es.js';
import * as enData from './ecosystemGuide.en.js';

const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? enData : esData;

export const { infographicData } = data;
