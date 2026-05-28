const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? require('./podcastGuide.en.js') : require('./podcastGuide.es.js');

export const MODULE_DATA = data.MODULE_DATA;
export const FINAL_CHALLENGE = data.FINAL_CHALLENGE;
