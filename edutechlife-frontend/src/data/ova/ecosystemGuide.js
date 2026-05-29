import * as esData from './ecosystemGuide.es.js';
import * as enData from './ecosystemGuide.en.js';

const getLocale = () => {
  try {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      ? (localStorage.getItem('edutechlife_locale') || 'es')
      : 'es';
  } catch {
    return 'es';
  }
};

const data = getLocale() === 'en' ? enData : esData;

export const { infographicData } = data;
