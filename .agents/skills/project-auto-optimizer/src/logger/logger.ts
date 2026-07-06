const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

export interface TortugaStats {
  startTime: Date;
  endTime: Date | null;
  vaultTag: string;
  recoveryBranch: string;
  projectsScanned: number;
  filesAnalyzed: number;
  filesImproved: number;
  filesSkipped: number;
  filesFailed: number;
  skillsApplied: Map<string, number>;
  depsInstalled: number;
  changesRejected: number;
}

export function createStats(): TortugaStats {
  return {
    startTime: new Date(),
    endTime: null,
    vaultTag: '',
    recoveryBranch: '',
    projectsScanned: 0,
    filesAnalyzed: 0,
    filesImproved: 0,
    filesSkipped: 0,
    filesFailed: 0,
    skillsApplied: new Map(),
    depsInstalled: 0,
    changesRejected: 0,
  };
}

export function logPhase(phase: string, message: string): void {
  console.log(`\n${BOLD}${CYAN}━━━ ${phase}${RESET}`);
  console.log(`   ${message}`);
}

export function logSuccess(message: string): void {
  console.log(`   ${GREEN}✓${RESET} ${message}`);
}

export function logWarning(message: string): void {
  console.log(`   ${YELLOW}⚠${RESET} ${message}`);
}

export function logError(message: string): void {
  console.log(`   ${RED}✗${RESET} ${message}`);
}

export function logInfo(message: string): void {
  console.log(`   ${BLUE}ℹ${RESET} ${message}`);
}

export function logDim(message: string): void {
  console.log(`   ${DIM}${GRAY}${message}${RESET}`);
}

export function logHeader(): void {
  console.log(`\n${BOLD}${MAGENTA}`);
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║           🐢  TORTUGA  v1.0             ║');
  console.log('  ║  Autonomous Optimization Agent           ║');
  console.log('  ║  "Slow is smooth, smooth is fast"        ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log(`${RESET}`);
}

export function logStats(stats: TortugaStats): void {
  stats.endTime = new Date();
  const duration = ((stats.endTime.getTime() - stats.startTime.getTime()) / 1000).toFixed(1);

  console.log(`\n${BOLD}${CYAN}━━━ TORTUGA — RESUMEN DE EJECUCIÓN${RESET}`);
  console.log(`   ${DIM}Duración: ${duration}s${RESET}`);
  console.log(`   ${GREEN}✓ Archivos mejorados: ${stats.filesImproved}${RESET}`);
  console.log(`   ${YELLOW}⚠ Archivos sin cambios: ${stats.filesSkipped}${RESET}`);
  console.log(`   ${RED}✗ Archivos con error: ${stats.filesFailed}${RESET}`);
  console.log(`   ${BLUE}ℹ Proyectos escaneados: ${stats.projectsScanned}${RESET}`);
  console.log(`   ${BLUE}ℹ Archivos analizados: ${stats.filesAnalyzed}${RESET}`);
  console.log(`   ${BLUE}ℹ Dependencias instaladas: ${stats.depsInstalled}${RESET}`);
  console.log(`   ${BLUE}ℹ Cambios rechazados: ${stats.changesRejected}${RESET}`);

  if (stats.skillsApplied.size > 0) {
    console.log(`\n   ${BOLD}Skills aplicadas:${RESET}`);
    for (const [skill, count] of stats.skillsApplied) {
      console.log(`   ${DIM}  - ${skill}: ${count} archivos${RESET}`);
    }
  }

  console.log(`\n   ${BOLD}Vault:${RESET} ${stats.vaultTag || 'N/A'}`);
  if (stats.recoveryBranch) {
    console.log(`   ${BOLD}Recovery:${RESET} ${stats.recoveryBranch}`);
  }
  console.log(`   ${BOLD}Para restaurar:${RESET} git checkout ${stats.vaultTag || '<tag>'}\n`);
}

export function logReportPath(path: string): void {
  console.log(`   ${BOLD}Reporte:${RESET} ${path}\n`);
}
