import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../i18n/I18nProvider";

const SITE_URL = "https://edutechlife.co";

const JsonLd = ({ title, breadcrumbs }) => {
  const { locale } = useTranslation();
  const location = useLocation();
  const IN_LANGUAGE = { en: "en-US", pt: "pt-BR", es: "es-CO" };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edutechlife",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-edutechlife.webp`,
    description:
      {
        en: "Leading the Future of Education with Pedagogy and Artificial Intelligence",
        pt: "Liderando o Futuro da Educação com Pedagogia e Inteligência Artificial",
        es: "Liderando la Educación del Futuro con Pedagogía e Inteligencia Artificial",
      }[locale] ||
      "Liderando la Educación del Futuro con Pedagogía e Inteligencia Artificial",
    sameAs: [
      "https://www.facebook.com/edutechlife",
      "https://www.instagram.com/edutechlife",
      "https://www.linkedin.com/company/edutechlife",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Edutechlife",
    url: SITE_URL,
    description:
      {
        en: "Educational platform powered by Artificial Intelligence",
        pt: "Plataforma educacional impulsionada por Inteligência Artificial",
        es: "Plataforma educativa impulsada por Inteligencia Artificial",
      }[locale] || "Plataforma educativa impulsada por Inteligencia Artificial",
    inLanguage: IN_LANGUAGE[locale] || "es-CO",
  };

  const schemas = [organization, website];

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title ? `${title} | Edutechlife` : "Edutechlife",
    url: `${SITE_URL}${location.pathname}`,
    inLanguage: IN_LANGUAGE[locale] || "es-CO",
    isPartOf: { "@id": `${SITE_URL}#website` },
  };
  schemas.push(webPage);

  if (breadcrumbs?.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: `${SITE_URL}${item.url}`,
      })),
    });
  }

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
};

export default JsonLd;
