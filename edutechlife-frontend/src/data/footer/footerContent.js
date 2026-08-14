import * as esContent from "./footerContent.es.js";
import * as enContent from "./footerContent.en.js";
import * as ptContent from "./footerContent.pt.js";

export function getFooterContent(locale) {
  if (locale === "pt") return ptContent;
  return locale === "en" ? enContent : esContent;
}
