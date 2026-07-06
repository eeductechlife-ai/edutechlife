import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SkillRegistry, getSkillsForFile } from '../core/skill-loader.js';
import { TortugaConfig, FileEntry } from '../core/file-classifier.js';
import { buildAnalysisPrompt } from '../core/prompt-builder.js';
import { parseLLMResponse, extractDependenciesFromCode } from '../core/response-parser.js';
import { PlannedChange } from './planner.js';
import * as gitManager from '../git/git-manager.js';
import * as validators from '../validation/validators.js';
import * as packageManager from '../package/package-manager.js';
import * as logger from '../logger/logger.js';
import { TortugaStats } from '../logger/logger.js';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');
const LLM_ENDPOINT = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = process.env.DEEPSEEK_API_KEY;

async function callLLM(prompt: string, model: string, maxTokens: number, temperature: number): Promise<string> {
  if (!API_KEY) {
    logger.logError('DEEPSEEK_API_KEY no configurada');
    return 'NO_CHANGES';
  }

  try {
    const response = await fetch(`${LLM_ENDPOINT.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'Eres Tortuga, un ingeniero senior. Retorna UNICAMENTE codigo o NO_CHANGES.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.logError(`LLM API error (${response.status})`);
      return 'NO_CHANGES';
    }

    const data = await response.json() as { choices: { message: { content: string } }[] };
    return data.choices?.[0]?.message?.content || 'NO_CHANGES';
  } catch (err) {
    logger.logError(`LLM call failed: ${err}`);
    return 'NO_CHANGES';
  }
}

export async function executePlan(
  plan: { changes: PlannedChange[] },
  config: TortugaConfig,
  skillRegistry: SkillRegistry,
  stats: TortugaStats,
): Promise<void> {
  logger.logPhase('FASE 3', 'EJECUCION - Aplicando mejoras controladas');

  const branchName = await gitManager.createOptimizationBranch();
  const maxChanges = parseInt(process.env.TORTUGA_MAX_CHANGES_PER_RUN || String(config.execution.maxChangesPerRun), 10);
  let changesApplied = 0;

  const projectCommands = new Map<string, validators.ValidationCommand[]>();
  for (const project of config.projects) {
    projectCommands.set(project.name, project.commands);
  }

  for (const change of plan.changes) {
    if (changesApplied >= maxChanges) {
      logger.logWarning(`Limite de ${maxChanges} cambios alcanzado`);
      break;
    }

    const absolutePath = resolve(ROOT, change.filePath);
    let originalContent: string;

    try {
      originalContent = readFileSync(absolutePath, 'utf-8');
    } catch {
      logger.logError(`No se pudo leer ${change.filePath}`);
      change.status = 'failed';
      stats.filesFailed++;
      continue;
    }

    const projectName = config.projects.find((p) => change.filePath.startsWith(p.srcDir))?.name || 'frontend';
    const ext = change.filePath.substring(change.filePath.lastIndexOf('.'));

    const fileEntry: FileEntry = {
      path: change.filePath,
      absolutePath,
      projectName,
      content: originalContent,
      extension: ext,
      size: originalContent.length,
    };

    const skills = getSkillsForFile(change.filePath, skillRegistry);
    const prompt = buildAnalysisPrompt(fileEntry, skills);
    logger.logDim(`Analizando: ${change.filePath}`);

    const llmResponse = await callLLM(
      prompt,
      config.analysis.deepseekModel,
      config.analysis.maxTokens,
      config.analysis.temperature,
    );

    const parsed = parseLLMResponse(llmResponse, fileEntry);

    if (!parsed.hasChanges) {
      logger.logWarning(`Sin cambios: ${change.filePath}`);
      change.status = 'skipped';
      stats.filesSkipped++;
      continue;
    }

    const deps = extractDependenciesFromCode(parsed.improvedCode || '');

    const project = config.projects.find((p) => change.filePath.startsWith(p.srcDir));
    if (project && deps.length > 0 && config.execution.autoInstallDeps) {
      logger.logInfo(`Verificando dependencias: ${deps.join(', ')}`);
      const depResult = packageManager.installMissingDependencies(deps, project.packageJson, project.name.replace('edutechlife-', ''));
      stats.depsInstalled += depResult.installed.length;
    }

    writeFileSync(absolutePath, parsed.improvedCode!, 'utf-8');
    logger.logInfo(`Escrito: ${change.filePath}`);

    const commands = projectCommands.get(projectName);
    if (commands && config.execution.validateBeforeCommit) {
      const result = validators.runProjectValidators(commands);

      if (result.success) {
        const skillNames = skills.map((s) => s.name);
        await gitManager.commitFile(change.filePath, skillNames, deps, change.category);
        change.status = 'applied';
        changesApplied++;
        stats.filesImproved++;

        for (const skill of skills) {
          stats.skillsApplied.set(skill.name, (stats.skillsApplied.get(skill.name) || 0) + 1);
        }
      } else {
        logger.logError(`Validacion fallo en ${change.filePath}: ${result.failedCommand}`);
        logger.logDim(result.error || result.output);
        await gitManager.revertFile(change.filePath, originalContent);
        change.status = 'failed';
        stats.filesFailed++;
      }
    } else {
      const skillNames = skills.map((s) => s.name);
      await gitManager.commitFile(change.filePath, skillNames, deps, change.category);
      change.status = 'applied';
      changesApplied++;
      stats.filesImproved++;

      for (const skill of skills) {
        stats.skillsApplied.set(skill.name, (stats.skillsApplied.get(skill.name) || 0) + 1);
      }
    }
  }

  await gitManager.cleanupBranch(branchName);

  logger.logSuccess(`Ejecucion completa: ${changesApplied} cambios aplicados`);
}
