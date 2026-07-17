import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://edutechlife.co'

const SEO = ({ title, description, ogImage, ogType, canonical, noindex, children }) => {
  const location = useLocation()
  const url = canonical || `${SITE_URL}${location.pathname}`
  const image = ogImage || '/og-image.png'
  const type = ogType || 'website'

  return (
    <Helmet>
      <title>{title} | Edutechlife</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="es_CO" />
      <meta property="og:site_name" content="Edutechlife" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {noindex && <meta name="robots" content="noindex" />}

      {children}
    </Helmet>
  )
}

export default SEO
