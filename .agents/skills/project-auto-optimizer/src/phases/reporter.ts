import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as logger from '../logger/logger.js';
import { TortugaStats } from '../logger/logger.js';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');
const docsDir = resolve(ROOT, 'docs', 'tortuga', 'reports');
const historyPath = resolve(ROOT, 'docs', 'tortuga', 'history.json');

interface HistoryEntry {
  date: string;
  filesImproved: number;
  filesFailed: number;
  filesSkipped: number;
  skillsUsed: Record<string, number>;
  depsInstalled: number;
  duration: string;
}

interface HistoryData {
  entries: HistoryEntry[];
  totals: {
    filesImproved: number;
    filesFailed: number;
    filesSkipped: number;
    depsInstalled: number;
  };
}

export function generateReport(stats: TortugaStats): void {
  logger.logPhase('FASE 4', 'REPORTE — Generando reporte final');

  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const duration = stats.endTime
    ? ((stats.endTime.getTime() - stats.startTime.getTime()) / 1000).toFixed(1)
    : 'N/A';

  const skillsUsed: Record<string, number> = {};
  for (const [skill, count] of stats.skillsApplied) {
    skillsUsed[skill] = count;
  }

  let md = `# Tortuga Execution Report\n\n`;
  md += `**Date:** ${stats.startTime.toISOString()}\n`;
  md += `**Duration:** ${duration}s\n`;
  md += `**Mode:** ${process.env.TORTUGA_MODE || 'auto'}\n\n`;

  md += `## Summary\n\n`;
  md += `| Metric | Value |\n|---|---|\n`;
  md += `| Files improved | ${stats.filesImproved} |\n`;
  md += `| Files skipped (no changes) | ${stats.filesSkipped} |\n`;
  md += `| Files failed | ${stats.filesFailed} |\n`;
  md += `| Changes rejected | ${stats.changesRejected} |\n`;
  md += `| Projects scanned | ${stats.projectsScanned} |\n`;
  md += `| Files analyzed | ${stats.filesAnalyzed} |\n`;
  md += `| Dependencies installed | ${stats.depsInstalled} |\n\n`;

  md += `## Skills Applied\n\n`;
  if (Object.keys(skillsUsed).length > 0) {
    md += `| Skill | Files |\n|---|---|\n`;
    for (const [skill, count] of Object.entries(skillsUsed)) {
      md += `| ${skill} | ${count} |\n`;
    }
  } else {
    md += `No skills were applied in this run.\n`;
  }
  md += `\n`;

  md += `## Vault & Recovery\n\n`;
  md += `- **Vault tag:** \`${stats.vaultTag}\`\n`;
  md += `- **Recovery branch:** \`${stats.recoveryBranch}\`\n`;
  md += `- **Restore command:** \`git checkout ${stats.vaultTag}\`\n\n`;

  md += `## Recommendations\n\n`;
  if (stats.filesFailed > 0) {
    md += `- ⚠️ ${stats.filesFailed} archivo(s) fallaron validación. Revisa los logs.\n`;
  }
  if (stats.filesImproved > 0) {
    md += `- ✅ ${stats.filesImproved} mejora(s) aplicadas. Revisa la branch de trabajo.\n`;
  }
  if (stats.filesImproved === 0 && stats.filesFailed === 0) {
    md += `- ℹ️ No se detectaron mejoras para aplicar en esta ejecución.\n`;
  }

  const reportPath = resolve(docsDir, `${dateStr}.md`);
  writeFileSync(reportPath, md, 'utf-8');
  logger.logReportPath(reportPath);

  updateHistory(stats, duration);
  logger.logStats(stats);
}

function updateHistory(stats: TortugaStats, duration: string): void {
  let history: HistoryData;

  try {
    if (existsSync(historyPath)) {
      history = JSON.parse(readFileSync(historyPath, 'utf-8'));
    } else {
      history = { entries: [], totals: { filesImproved: 0, filesFailed: 0, filesSkipped: 0, depsInstalled: 0 } };
    }
  } catch {
    history = { entries: [], totals: { filesImproved: 0, filesFailed: 0, filesSkipped: 0, depsInstalled: 0 } };
  }

  const skillsUsed: Record<string, number> = {};
  for (const [skill, count] of stats.skillsApplied) {
    skillsUsed[skill] = count;
  }

  const entry: HistoryEntry = {
    date: stats.startTime.toISOString(),
    filesImproved: stats.filesImproved,
    filesFailed: stats.filesFailed,
    filesSkipped: stats.filesSkipped,
    skillsUsed,
    depsInstalled: stats.depsInstalled,
    duration,
  };

  history.entries.push(entry);

  history.totals.filesImproved += stats.filesImproved;
  history.totals.filesFailed += stats.filesFailed;
  history.totals.filesSkipped += stats.filesSkipped;
  history.totals.depsInstalled += stats.depsInstalled;

  writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8');
}
