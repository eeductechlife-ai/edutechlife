export default {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/smartboard',
        'http://localhost:4173/smartboard/estadisticas',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        skipAudits: ['uses-http2'],
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'total-byte-weight': ['warn', { maxNumericValue: 3000000 }],
        'unused-javascript': 'off',
        'unused-css-rules': 'off',
        'uses-webp-images': 'off',
        'legacy-javascript': 'off',
        'is-on-https': 'off',
        'redirects-http': 'off',
        'csp-xss': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
