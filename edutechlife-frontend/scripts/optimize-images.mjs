import { execSync } from 'child_process'
import { readdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'

const PUBLIC = join(import.meta.dirname, '../public')
const QUALITY = 85

const images = []

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fp = join(dir, entry.name)
    if (entry.isDirectory()) walk(fp)
    else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) images.push(fp)
  }
}

walk(PUBLIC)

let converted = 0
let skipped = 0
let savedBytes = 0

for (const img of images) {
  const ext = extname(img)
  const webp = img.replace(ext, '.webp')

  if (existsSync(webp) && statSync(webp).mtimeMs > statSync(img).mtimeMs) {
    skipped++
    continue
  }

  const before = statSync(img).size
  execSync(`ffmpeg -y -i "${img}" -quality ${QUALITY} -compression_level 6 "${webp}" 2>/dev/null`)
  const after = statSync(webp).size
  converted++
  savedBytes += before - after
  console.log(`✓ ${img.replace(PUBLIC, '')} (${(before / 1024).toFixed(0)}K → ${(after / 1024).toFixed(0)}K)`)
}

console.log(`\nConverted: ${converted}, Skipped: ${skipped}, Saved: ${(savedBytes / 1024).toFixed(0)}KB`)
