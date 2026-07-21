import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const BASE = 'https://edutechlife.co'

const ROUTES = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/neuroentorno', priority: 0.8, changefreq: 'monthly' },
  { loc: '/proyectos', priority: 0.8, changefreq: 'monthly' },
  { loc: '/consultoria', priority: 0.7, changefreq: 'monthly' },
  { loc: '/consultoria-b2b', priority: 0.7, changefreq: 'monthly' },
  { loc: '/automation', priority: 0.7, changefreq: 'monthly' },
  { loc: '/vak', priority: 0.9, changefreq: 'monthly' },
  { loc: '/vak-simple', priority: 0.7, changefreq: 'monthly' },
  { loc: '/vak-premium', priority: 0.8, changefreq: 'monthly' },
  { loc: '/ialab-academic', priority: 0.9, changefreq: 'weekly' },
  { loc: '/conoce-smartboard', priority: 0.8, changefreq: 'monthly' },
  { loc: '/smartboard', priority: 0.9, changefreq: 'weekly' },
  { loc: '/smartboard/padres', priority: 0.7, changefreq: 'monthly' },
  { loc: '/sign-up/ialab', priority: 0.5, changefreq: 'monthly' },
  { loc: '/sign-up/smartboard', priority: 0.5, changefreq: 'monthly' },
  { loc: '/login', priority: 0.4, changefreq: 'monthly' },
  { loc: '/ialab', priority: 0.6, changefreq: 'weekly' },
]

const today = new Date().toISOString().split('T')[0]

const urlElement = (loc, priority, changefreq, alternates) => {
  const altTags = alternates.map(a =>
    `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${BASE}${a.href}" />`
  ).join('\n')
  return `  <url>
    <loc>${BASE}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${altTags}
  </url>`
}

const urls = ROUTES.map(r => {
  const altEs = r.loc === '/' ? { href: '/', hreflang: 'es' } : { href: r.loc, hreflang: 'es' }
  const altEn = { href: `/en${r.loc}`, hreflang: 'en' }
  const altXDefault = r.loc === '/' ? { href: '/', hreflang: 'x-default' } : { href: r.loc, hreflang: 'x-default' }
  return urlElement(r.loc, r.priority, r.changefreq, [altEs, altEn, altXDefault])
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

const out = join(__dirname, '../dist/sitemap.xml')
writeFileSync(out, xml)
console.log(`[sitemap] ✅ ${out}`)
