import * as esData from './riskSim.es.js';
import * as enData from './riskSim.en.js';

const locale = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? (localStorage.getItem('edutechlife_locale') || 'es')
  : 'es';

const data = locale === 'en' ? enData : esData;

export const { gameData, accordionData, mitigations } = data;
