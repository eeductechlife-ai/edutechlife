import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../i18n/I18nProvider'
import JsonLd from './JsonLd'

const SITE_URL = 'https://edutechlife.co'

const SEO = ({ title, description, ogImage, ogType, canonical, noindex, children, lang, breadcrumbs }) => {
  const { locale } = useTranslation()
  const location = useLocation()
  const url = canonical || `${SITE_URL}${location.pathname}`
  const isEn = locale === 'en'
  const image = ogImage || (isEn ? '/og-image-en.svg' : '/og-image.svg')
  const type = ogType || 'website'
  const ogLocale = isEn ? 'en_US' : 'es_CO'
  const currentLang = lang || (isEn ? 'en' : 'es')

  return (
    <>
    <Helmet>
      <html lang={currentLang} />
      <title>{title} | Edutechlife</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <link rel="alternate" hrefLang="es" href={`${SITE_URL}${location.pathname.replace(/^\/en/, '')}`} />
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en${location.pathname.replace(/^\/en/, '')}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${location.pathname.replace(/^\/en/, '')}`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content="Edutechlife" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {noindex && <meta name="robots" content="noindex" />}

      {children}
    </Helmet>
    <JsonLd title={title} breadcrumbs={breadcrumbs} />
    </>
  )
}

export default SEO
