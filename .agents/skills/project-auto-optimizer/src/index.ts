import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'node:path';
import { loadConfig } from './core/file-classifier.js';
import { loadAllSkills } from './core/skill-loader.js';
import { createVault } from './phases/vault.js';
import { runAnalysis } from './phases/analysis.js';
import { generatePlan } from './phases/planner.js';
import { executePlan } from './phases/executor.js';
import { generateReport } from './phases/reporter.js';
import * as logger from './logger/logger.js';

const envPath = resolve(import.meta.dirname, '..', '.env');
dotenvConfig({ path: envPath });

const args = process.argv.slice(2);
const ANALYZE_ONLY = args.includes('--analyze-only');
const PLAN_ONLY = args.includes('--plan');
const APPLY_MODE = args.includes('--apply');
const AUTO_MODE = args.includes('--auto');

async function main(): Promise<void> {
  logger.logHeader();

  if (!process.env.DEEPSEEK_API_KEY) {
    logger.logWarning('DEEPSEEK_API_KEY no configurada. Modo analisis local solamente.');
    logger.logDim(`Crea un archivo .env en: ${envPath}`);
    logger.logDim('Contenido: DEEPSEEK_API_KEY=sk-tu-api-key');
  }

  const config = loadConfig();
  logger.logInfo(`Modo: ${AUTO_MODE ? 'auto' : ANALYZE_ONLY ? 'analisis' : PLAN_ONLY ? 'plan' : APPLY_MODE ? 'aplicar' : 'completo'}`);

  const skillRegistry = loadAllSkills(config.skills.searchPaths);
  logger.logSuccess(`Skills cargadas: ${skillRegistry.all.length}`);
  logger.logDim(`(${skillRegistry.all.map((s) => s.name).join(', ')})`);

  const stats = logger.createStats();

  const vaultResult = await createVault(stats);
  if (!vaultResult.success) {
    logger.logError('No se pudo crear el vault. Abortando.');
    process.exit(1);
  }

  const analysisReport = await runAnalysis(config, skillRegistry, stats);

  if (ANALYZE_ONLY) {
    logger.logSuccess('Modo analisis-only completado. No se escribieron cambios.');
    logger.logStats(stats);
    return;
  }

  const plan = generatePlan(analysisReport, analysisReport.timestamp, stats);

  if (PLAN_ONLY) {
    logger.logSuccess('Modo plan-only completado. Revisa el plan antes de aplicar.');
    logger.logInfo('Ejecuta: npm run tortuga:apply');
    logger.logStats(stats);
    return;
  }

  if (plan.changes.length > 0) {
    await executePlan(plan, config, skillRegistry, stats);
  } else {
    logger.logInfo('No hay mejoras para aplicar en esta ejecucion.');
  }

  generateReport(stats);

  logger.logSuccess(' Tortuga ha completado su ejecucion.');
}

main().catch((err) => {
  logger.logError(`Error fatal: ${err}`);
  process.exit(1);
});
