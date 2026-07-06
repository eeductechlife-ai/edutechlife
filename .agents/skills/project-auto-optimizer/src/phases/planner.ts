import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { AnalysisReport } from './analysis.js';
import * as logger from '../logger/logger.js';
import { TortugaStats } from '../logger/logger.js';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');
const docsDir = resolve(ROOT, 'docs', 'tortuga', 'plans');

export interface PlannedChange {
  filePath: string;
  issueDescription: string;
  severity: string;
  category: string;
  skills: string[];
  risk: 'low' | 'medium' | 'high';
  order: number;
  status: 'pending' | 'applied' | 'skipped' | 'failed';
}

export interface ImprovementPlan {
  timestamp: string;
  basedOnAnalysis: string;
  totalChanges: number;
  changes: PlannedChange[];
  summary: {
    low: number;
    medium: number;
    high: number;
  };
}

export function generatePlan(
  analysisReport: AnalysisReport,
  analysisTimestamp: string,
  stats: TortugaStats,
): ImprovementPlan {
  logger.logPhase('FASE 2', 'PLAN — Generando plan de mejora priorizado');

  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true });
  }

  const changes: PlannedChange[] = [];

  for (const issue of analysisReport.issues) {
    const risk = severityToRisk(issue.severity);
    changes.push({
      filePath: issue.filePath,
      issueDescription: issue.description,
      severity: issue.severity,
      category: issue.category,
      skills: issue.suggestedSkills || [],
      risk,
      order: 0,
      status: 'pending',
    });
  }

  const priorityOrder: Record<string, number> = {
    seguridad: 0,
    performance: 1,
    arquitectura: 2,
    'ui-ux': 3,
    animacion: 4,
    accesibilidad: 5,
    codigo: 6,
  };

  changes.sort((a, b) => {
    const aPriority = priorityOrder[a.category] ?? 99;
    const bPriority = priorityOrder[b.category] ?? 99;
    if (aPriority !== bPriority) return aPriority - bPriority;
    const aRisk = riskScore(a.risk);
    const bRisk = riskScore(b.risk);
    return aRisk - bRisk;
  });

  changes.forEach((c, i) => { c.order = i + 1; });

  const plan: ImprovementPlan = {
    timestamp: new Date().toISOString(),
    basedOnAnalysis: analysisTimestamp,
    totalChanges: changes.length,
    changes,
    summary: {
      low: changes.filter((c) => c.risk === 'low').length,
      medium: changes.filter((c) => c.risk === 'medium').length,
      high: changes.filter((c) => c.risk === 'high').length,
    },
  };

  savePlan(plan);

  logger.logSuccess(`Plan generado: ${plan.totalChanges} mejoras`);
  logger.logInfo(`Riesgo bajo: ${plan.summary.low} | Medio: ${plan.summary.medium} | Alto: ${plan.summary.high}`);

  return plan;
}

function severityToRisk(severity: string): 'low' | 'medium' | 'high' {
  switch (severity) {
    case 'critical': return 'medium';
    case 'moderate': return 'low';
    case 'minor': return 'low';
    default: return 'low';
  }
}

function riskScore(risk: string): number {
  return risk === 'high' ? 2 : risk === 'medium' ? 1 : 0;
}

function savePlan(plan: ImprovementPlan): void {
  const dateStr = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const planPath = resolve(docsDir, `${dateStr}.md`);

  let md = `# Tortuga Improvement Plan\n\n`;
  md += `**Date:** ${plan.timestamp}\n`;
  md += `**Based on analysis:** ${plan.basedOnAnalysis}\n`;
  md += `**Total changes planned:** ${plan.totalChanges}\n\n`;
  md += `## Risk Summary\n\n`;
  md += `| Risk | Count |\n|---|---|\n`;
  md += `| Low | ${plan.summary.low} |\n`;
  md += `| Medium | ${plan.summary.medium} |\n`;
  md += `| High | ${plan.summary.high} |\n\n`;
  md += `## Execution Order\n\n`;
  md += `| # | File | Category | Risk | Skills |\n|---|---|---|---|---|\n`;
  for (const change of plan.changes) {
    const skills = change.skills.join(', ') || 'N/A';
    md += `| ${change.order} | ${change.filePath} | ${change.category} | ${change.risk} | ${skills} |\n`;
  }
  md += `\n## Details\n\n`;
  for (const change of plan.changes) {
    md += `### ${change.order}. ${change.filePath}\n`;
    md += `- **Issue:** ${change.issueDescription}\n`;
    md += `- **Severity:** ${change.severity}\n`;
    md += `- **Category:** ${change.category}\n`;
    md += `- **Risk:** ${change.risk}\n`;
    md += `- **Skills:** ${change.skills.join(', ') || 'N/A'}\n`;
    md += `- **Status:** ${change.status}\n\n`;
  }

  writeFileSync(planPath, md, 'utf-8');
  logger.logReportPath(planPath);
}
