const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? require('./biasLab.en.js') : require('./biasLab.es.js');

export const contentData = data.contentData;
export const gameData = data.gameData;
