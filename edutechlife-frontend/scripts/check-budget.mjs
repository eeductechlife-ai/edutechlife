import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const ASSETS = join(import.meta.dirname, '../dist/assets')
const BUDGET = {
  maxTotalJS: 9.5 * 1024 * 1024,
  maxChunkJS: 1200 * 1024,
  maxTotalCSS: 700 * 1024,
}

const LAZY_OK = ['pdf-vendor', 'pdf-', 'IALab', 'DiagnosticoVAK', 'xlsx']

const files = readdirSync(ASSETS)
let totalJS = 0
let totalCSS = 0
let errors = []

for (const f of files) {
  const fp = join(ASSETS, f)
  const size = statSync(fp).size
  const isLazy = LAZY_OK.some(p => f.includes(p))

  if (f.endsWith('.js')) {
    totalJS += size
    if (size > BUDGET.maxChunkJS && !isLazy) {
      errors.push(`CHUNK OVER BUDGET: ${f} ${(size / 1024).toFixed(1)}KB > ${BUDGET.maxChunkJS / 1024}KB`)
    }
  }
  if (f.endsWith('.css')) {
    totalCSS += size
  }
}

if (totalJS > BUDGET.maxTotalJS) {
  errors.push(`TOTAL JS OVER BUDGET: ${(totalJS / 1024 / 1024).toFixed(1)}MB > ${BUDGET.maxTotalJS / 1024 / 1024}MB`)
}
if (totalCSS > BUDGET.maxTotalCSS) {
  errors.push(`TOTAL CSS OVER BUDGET: ${(totalCSS / 1024).toFixed(1)}KB > ${BUDGET.maxTotalCSS / 1024}KB`)
}

console.log(`Total JS: ${(totalJS / 1024 / 1024).toFixed(1)}MB (budget: ${BUDGET.maxTotalJS / 1024 / 1024}MB)`)
console.log(`Total CSS: ${(totalCSS / 1024).toFixed(1)}KB (budget: ${BUDGET.maxTotalCSS / 1024}KB)`)

if (errors.length > 0) {
  console.error('\n=== BUDGET VIOLATIONS ===')
  errors.forEach(e => console.error(`  ❌ ${e}`))
  process.exit(1)
} else {
  console.log('\n✅ All budgets passed')
}
