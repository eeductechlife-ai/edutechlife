import * as esData from './podcastGuide.es.jsx';
import * as enData from './podcastGuide.en.jsx';

const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? enData : esData;

export const MODULE_DATA = data.MODULE_DATA;
export const FINAL_CHALLENGE = data.FINAL_CHALLENGE;
