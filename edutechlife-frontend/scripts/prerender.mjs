import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer-core'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

const PUBLIC_ROUTES = [
  '/', '/neuroentorno', '/proyectos', '/consultoria', '/consultoria-b2b',
  '/automation', '/vak', '/vak-simple', '/vak-premium', '/ialab-academic',
  '/conoce-smartboard', '/smartboard', '/smartboard/padres',
  '/sign-up/ialab', '/sign-up/smartboard', '/login',
]

const CONCURRENCY = 2

const MIME_TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.json': 'application/json',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
}

const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium',
  ...(os.platform() === 'win32'
    ? ['C:\\Program Files\\Google Chrome\\Application\\chrome.exe',
       'C:\\Program Files (x86)\\Google Chrome\\Application\\chrome.exe']
    : []),
]

function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url)

    const ext = path.extname(filePath)
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    if (!ext || ext === '.html') {
      const htmlPath = fs.existsSync(filePath) && ext ? filePath
        : path.join(distDir, 'index.html')
      fs.readFile(htmlPath, (err, data) => {
        if (err) { res.writeHead(500); res.end('Error') }
        else { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(data) }
      })
    } else {
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found') }
        else { res.writeHead(200, { 'Content-Type': contentType }); res.end(data) }
      })
    }
  })
}

async function renderRoute(page, route) {
  const url = `http://127.0.0.1:4173${route}`
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 15000 })
    await new Promise(r => setTimeout(r, 1000))
  } catch (e) {
    await new Promise(r => setTimeout(r, 2000))
  }
  try {
    const html = await page.content()
    const outputDir = route === '/' ? distDir : path.join(distDir, route.slice(1))
    fs.mkdirSync(outputDir, { recursive: true })
    fs.writeFileSync(path.join(outputDir, 'index.html'), html)
    console.log(`[prerender] ✅ ${route}`)
  } catch (e) {
    console.warn(`[prerender] ⚠️ ${route}: ${e.message}`)
  }
}

async function main() {
  const executablePath = chromePaths.find(p => fs.existsSync(p))
  if (!executablePath) {
    console.log('[prerender] No Chrome/Chromium found. Skipping prerendering.')
    console.log('[prerender] To install Chrome: https://www.google.com/chrome/')
    process.exit(0)
  }

  if (!fs.existsSync(distDir)) {
    console.log('[prerender] dist/ not found. Run "npm run build" first.')
    process.exit(1)
  }

  const server = createServer()
  await new Promise(r => server.listen(4173, '127.0.0.1', r))
  console.log('[prerender] Server started on http://127.0.0.1:4173')

  let browser
  try {
    browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new'],
    })

    const results = []
    for (let i = 0; i < PUBLIC_ROUTES.length; i += CONCURRENCY) {
      const batch = PUBLIC_ROUTES.slice(i, i + CONCURRENCY)
      const batchResults = await Promise.all(
        batch.map(async (route) => {
          const page = await browser.newPage()
          await page.setViewport({ width: 1920, height: 1080 })
          try {
            await renderRoute(page, route)
          } finally {
            await page.close()
          }
        })
      )
      results.push(...batchResults)
    }
  } catch (e) {
    console.error('[prerender] ❌ Failed:', e.message)
    process.exitCode = 1
  } finally {
    if (browser) await browser.close()
    await new Promise(r => server.close(r))
  }

  console.log('[prerender] Done.')
}

main()
