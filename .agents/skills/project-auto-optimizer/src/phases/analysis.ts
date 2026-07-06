import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadAllSkills, getSkillsForFile, SkillRegistry } from '../core/skill-loader.js';
import { scanAllFiles, loadConfig, FileEntry } from '../core/file-classifier.js';
import { TortugaConfig } from '../core/file-classifier.js';
import * as logger from '../logger/logger.js';
import { TortugaStats } from '../logger/logger.js';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');
const docsDir = resolve(ROOT, 'docs', 'tortuga', 'analysis');

export interface AnalysisIssue {
  filePath: string;
  severity: 'critical' | 'moderate' | 'minor';
  category: string;
  description: string;
  suggestedSkills: string[];
}

export interface AnalysisReport {
  timestamp: string;
  projectsScanned: number;
  totalFiles: number;
  totalIssues: number;
  issues: AnalysisIssue[];
  filesPerProject: Map<string, number>;
  skillCoverage: Map<string, number>;
  summary: {
    critical: number;
    moderate: number;
    minor: number;
  };
}

const LLM_ENDPOINT = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = process.env.DEEPSEEK_API_KEY;

async function callLLM(prompt: string, model: string, maxTokens: number, temperature: number): Promise<string> {
  if (!API_KEY) {
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
          { role: 'system', content: 'Eres un analista de código senior. Responde ÚNICAMENTE con el análisis solicitado, sin explicaciones adicionales.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.logError(`LLM API error (${response.status}): ${errorText}`);
      return 'NO_CHANGES';
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[];
    };
    return data.choices?.[0]?.message?.content || 'NO_CHANGES';
  } catch (err) {
    logger.logError(`LLM call failed: ${err}`);
    return 'NO_CHANGES';
  }
}

export async function runAnalysis(
  config: TortugaConfig,
  skillRegistry: SkillRegistry,
  stats: TortugaStats,
): Promise<AnalysisReport> {
  logger.logPhase('FASE 1', 'ANÁLISIS — Escaneando código fuente (solo lectura)');

  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true });
  }

  const projectFiles = scanAllFiles(config);
  const now = new Date().toISOString();

  const report: AnalysisReport = {
    timestamp: now,
    projectsScanned: 0,
    totalFiles: 0,
    totalIssues: 0,
    issues: [],
    filesPerProject: new Map(),
    skillCoverage: new Map(),
    summary: { critical: 0, moderate: 0, minor: 0 },
  };

  const analysisPromptParts: string[] = [];

  for (const [projectName, files] of projectFiles) {
    report.projectsScanned++;
    report.filesPerProject.set(projectName, files.length);
    stats.projectsScanned++;

    logger.logInfo(`Proyecto: ${projectName} (${files.length} archivos)`);

    for (const file of files) {
      stats.filesAnalyzed++;

      const skills = getSkillsForFile(file.path, skillRegistry);
      for (const skill of skills) {
        const current = report.skillCoverage.get(skill.name) || 0;
        report.skillCoverage.set(skill.name, current + 1);
      }

      const skillNames = skills.map((s) => s.name).join(', ');
      logger.logDim(`${file.path} → [${skillNames || 'ninguna'}]`);

      analysisPromptParts.push(`Archivo: ${file.path}
Skills: ${skillNames || 'ninguna'}
\`\`\`
${file.content.slice(0, 2000)}
\`\`\``);

      if (analysisPromptParts.length >= config.analysis.batchSize) {
        const batchPrompt = `Analiza estos archivos y lista problemas encontrados en formato:
SEVERITY: critical|moderate|minor
CATEGORY: seguridad|performance|arquitectura|ui-ux|animacion|accesibilidad|codigo
DESCRIPTION: descripción breve

${analysisPromptParts.join('\n---\n')}`;

        const llmResponse = await callLLM(
          batchPrompt,
          config.analysis.deepseekModel,
          config.analysis.maxTokens,
          config.analysis.temperature,
        );

        parseAnalysisResponse(llmResponse, report);
        analysisPromptParts.length = 0;
      }
    }
  }

  if (analysisPromptParts.length > 0) {
    const batchPrompt = `Analiza estos archivos y lista problemas encontrados...

${analysisPromptParts.join('\n---\n')}`;

    const llmResponse = await callLLM(
      batchPrompt,
      config.analysis.deepseekModel,
      config.analysis.maxTokens,
      config.analysis.temperature,
    );

    parseAnalysisResponse(llmResponse, report);
  }

  report.totalFiles = [...report.filesPerProject.values()].reduce((a, b) => a + b, 0);
  report.totalIssues = report.issues.length;
  report.summary.critical = report.issues.filter((i) => i.severity === 'critical').length;
  report.summary.moderate = report.issues.filter((i) => i.severity === 'moderate').length;
  report.summary.minor = report.issues.filter((i) => i.severity === 'minor').length;

  saveReport(report);

  logger.logSuccess(`Analysis complete: ${report.totalFiles} archivos, ${report.totalIssues} issues`);
  logger.logInfo(`Críticas: ${report.summary.critical} | Moderadas: ${report.summary.moderate} | Menores: ${report.summary.minor}`);

  return report;
}

function parseAnalysisResponse(llmResponse: string, report: AnalysisReport): void {
  const lines = llmResponse.split('\n');
  let current: Partial<AnalysisIssue> = {};

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('SEVERITY:')) {
      if (current.filePath && current.description) {
        current.severity = current.severity || 'minor';
        current.category = current.category || 'codigo';
        report.issues.push(current as AnalysisIssue);
      }
      current = {};
      const val = trimmed.replace('SEVERITY:', '').trim().toLowerCase();
      if (val === 'critical' || val === 'moderate' || val === 'minor') {
        current.severity = val;
      }
    } else if (trimmed.startsWith('CATEGORY:')) {
      current.category = trimmed.replace('CATEGORY:', '').trim();
    } else if (trimmed.startsWith('DESCRIPTION:')) {
      current.description = trimmed.replace('DESCRIPTION:', '').trim();
    } else if (trimmed.startsWith('Archivo:') || trimmed.startsWith('FILE:')) {
      current.filePath = trimmed.replace(/^(Archivo:|FILE:)\s*/, '').trim();
    }
  }

  if (current.filePath && current.description) {
    current.severity = current.severity || 'minor';
    current.category = current.category || 'codigo';
    report.issues.push(current as AnalysisIssue);
  }
}

function saveReport(report: AnalysisReport): void {
  const dateStr = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const reportPath = resolve(docsDir, `${dateStr}.md`);

  let md = `# Tortuga Analysis Report\n\n`;
  md += `**Date:** ${report.timestamp}\n`;
  md += `**Files analyzed:** ${report.totalFiles}\n`;
  md += `**Projects scanned:** ${report.projectsScanned}\n`;
  md += `**Total issues:** ${report.totalIssues}\n\n`;
  md += `## Summary\n\n`;
  md += `| Severity | Count |\n|---|---|\n`;
  md += `| Critical | ${report.summary.critical} |\n`;
  md += `| Moderate | ${report.summary.moderate} |\n`;
  md += `| Minor | ${report.summary.minor} |\n\n`;
  md += `## Files per Project\n\n`;
  md += `| Project | Files |\n|---|---|\n`;
  for (const [project, count] of report.filesPerProject) {
    md += `| ${project} | ${count} |\n`;
  }
  md += `\n## Issues\n\n`;
  for (const issue of report.issues) {
    md += `### [${issue.severity.toUpperCase()}] ${issue.filePath}\n`;
    md += `- **Category:** ${issue.category}\n`;
    md += `- **Description:** ${issue.description}\n`;
    md += `- **Suggested skills:** ${issue.suggestedSkills?.join(', ') || 'N/A'}\n\n`;
  }

  writeFileSync(reportPath, md, 'utf-8');
  logger.logReportPath(reportPath);
}
