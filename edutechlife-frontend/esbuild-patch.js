import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const esbuildPath = require.resolve('vite/node_modules/esbuild/lib/main.js')

const originalModule = require(esbuildPath)

const originalEnsure = originalModule.ensureServiceIsRunning
let restartAttempts = 0

originalModule.ensureServiceIsRunning = function() {
  try {
    return originalEnsure()
  } catch (e) {
    if (restartAttempts < 3 && (e.message || '').includes('EPIPE')) {
      restartAttempts++
      console.warn('[esbuild-patch] Service crashed, restarting...')
      return originalEnsure()
    }
    throw e
  }
}

export default originalModule
