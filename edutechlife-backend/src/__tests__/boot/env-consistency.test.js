const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');

const SMARTBOARD_SERVICES = [
  'src/services/adaptiveLearning.js',
  'src/services/badgeEngine.js',
  'src/services/missionEngine.js',
  'src/services/earlyWarning.js',
  'src/services/parentInsights.js',
  'src/services/daniOrchestrator.js',
  'src/services/competencyMastery.js',
  'src/services/metricsService.js',
];

const CANONICAL = 'SUPABASE_SERVICE_ROLE_KEY';

describe('env consistency — SmartBoard boot', () => {
  describe.each(SMARTBOARD_SERVICES)('%s', (rel) => {
    it('lee la env var canónica SUPABASE_SERVICE_ROLE_KEY', () => {
      const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
      expect(src).toContain(CANONICAL);
    });
  });

  it('db/supabase.js usa la canónica como primera opción', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/db/supabase.js'), 'utf8');
    const canonicalIdx = src.indexOf(CANONICAL);
    const legacyIdx = src.indexOf('SUPABASE_SERVICE_KEY');
    expect(canonicalIdx).toBeGreaterThanOrEqual(0);
    expect(canonicalIdx).toBeLessThan(legacyIdx);
  });

  it('db/sessionClient.js usa la canónica como primera opción', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/db/sessionClient.js'), 'utf8');
    const canonicalIdx = src.indexOf(CANONICAL);
    const legacyIdx = src.indexOf('SUPABASE_SERVICE_KEY');
    expect(canonicalIdx).toBeGreaterThanOrEqual(0);
    expect(canonicalIdx).toBeLessThan(legacyIdx);
  });

  it('test-setup.js define la canónica', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/test-setup.js'), 'utf8');
    expect(src).toContain(`process.env.${CANONICAL}`);
  });

  it('.env.example documenta SUPABASE_URL y la canónica', () => {
    const example = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8');
    expect(example).toContain('SUPABASE_URL=');
    expect(example).toContain(`${CANONICAL}=`);
  });
});
