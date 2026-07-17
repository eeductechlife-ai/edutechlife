import { writeFileSync } from 'fs'
import { join } from 'path'

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

const urls = ROUTES.map(r => `  <url>
    <loc>${BASE}${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const out = join(import.meta.dirname, '../dist/sitemap.xml')
writeFileSync(out, xml)
console.log(`[sitemap] ✅ ${out}`)
