import * as esContent from './footerContent.es.js';
import * as enContent from './footerContent.en.js';

export function getFooterContent(locale) {
  return locale === 'en' ? enContent : esContent;
}
