import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

export interface FileEntry {
  path: string;
  absolutePath: string;
  projectName: string;
  content: string;
  extension: string;
  size: number;
}

export interface ProjectConfig {
  name: string;
  srcDir: string;
  packageJson: string;
  commands: { name: string; cmd: string; cwd: string }[];
}

export interface ExecutionConfig {
  mode: string;
  maxChangesPerRun: number;
  requireApproval: boolean;
  autoInstallDeps: boolean;
  validateBeforeCommit: boolean;
}

export interface SkillConfig {
  searchPaths: string[];
  excludeSkills: string[];
  priorityCategories: string[];
}

export interface AnalysisConfig {
  batchSize: number;
  deepseekModel: string;
  deepseekBaseUrl: string;
  maxTokens: number;
  temperature: number;
}

export interface VaultConfig {
  keepLastNVaults: number;
  autoPushToRemote: boolean;
}

export interface TortugaConfig {
  name: string;
  extensions: string[];
  ignoreDirs: string[];
  projects: ProjectConfig[];
  skills: SkillConfig;
  execution: ExecutionConfig;
  analysis: AnalysisConfig;
  vault: VaultConfig;
}

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');

export function loadConfig(): TortugaConfig {
  const configPath = join(import.meta.dirname, '..', 'config', 'tortuga.json');
  const raw = readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  return {
    name: (parsed.name as string) || 'tortuga',
    extensions: parsed.extensions as string[] || ['.ts', '.tsx', '.js', '.jsx'],
    ignoreDirs: parsed.ignoreDirs as string[] || ['node_modules', '.next', '.git', 'dist', 'build'],
    projects: (parsed.projects as ProjectConfig[]) || [],
    skills: {
      searchPaths: ((parsed.skills as Record<string, unknown>)?.searchPaths as string[]) || ['.agents/skills'],
      excludeSkills: ((parsed.skills as Record<string, unknown>)?.excludeSkills as string[]) || [],
      priorityCategories: ((parsed.skills as Record<string, unknown>)?.priorityCategories as string[]) || [],
    },
    execution: {
      mode: ((parsed.execution as Record<string, unknown>)?.mode as string) || 'auto',
      maxChangesPerRun: ((parsed.execution as Record<string, unknown>)?.maxChangesPerRun as number) || 15,
      requireApproval: ((parsed.execution as Record<string, unknown>)?.requireApproval as boolean) || false,
      autoInstallDeps: ((parsed.execution as Record<string, unknown>)?.autoInstallDeps as boolean) || true,
      validateBeforeCommit: ((parsed.execution as Record<string, unknown>)?.validateBeforeCommit as boolean) || true,
    },
    analysis: {
      batchSize: ((parsed.analysis as Record<string, unknown>)?.batchSize as number) || 5,
      deepseekModel: ((parsed.analysis as Record<string, unknown>)?.deepseekModel as string) || 'deepseek-chat',
      deepseekBaseUrl: ((parsed.analysis as Record<string, unknown>)?.deepseekBaseUrl as string) || 'https://api.deepseek.com/v1',
      maxTokens: ((parsed.analysis as Record<string, unknown>)?.maxTokens as number) || 4096,
      temperature: ((parsed.analysis as Record<string, unknown>)?.temperature as number) || 0.3,
    },
    vault: {
      keepLastNVaults: ((parsed.vault as Record<string, unknown>)?.keepLastNVaults as number) || 30,
      autoPushToRemote: ((parsed.vault as Record<string, unknown>)?.autoPushToRemote as boolean) || false,
    },
  };
}

export function scanProjectFiles(project: ProjectConfig, config: TortugaConfig): FileEntry[] {
  const results: FileEntry[] = [];
  const projectPath = join(ROOT, project.srcDir);

  if (!existsSync(projectPath)) {
    return results;
  }

  function walk(dir: string) {
    let dirEntries;
    try {
      dirEntries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of dirEntries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (config.ignoreDirs.includes(entry.name)) continue;
        if (entry.name.startsWith('.')) continue;
        walk(fullPath);
        continue;
      }

      const ext = entry.name.substring(entry.name.lastIndexOf('.'));
      if (!config.extensions.includes(ext)) continue;

      try {
        const content = readFileSync(fullPath, 'utf-8');
        const stats = statSync(fullPath);
        results.push({
          path: relative(ROOT, fullPath),
          absolutePath: fullPath,
          projectName: project.name,
          content,
          extension: ext,
          size: stats.size,
        });
      } catch {
        continue;
      }
    }
  }

  walk(projectPath);
  return results;
}

export function scanAllFiles(config: TortugaConfig): Map<string, FileEntry[]> {
  const byProject = new Map<string, FileEntry[]>();

  for (const project of config.projects) {
    const files = scanProjectFiles(project, config);
    if (files.length > 0) {
      byProject.set(project.name, files);
    }
  }

  return byProject;
}
