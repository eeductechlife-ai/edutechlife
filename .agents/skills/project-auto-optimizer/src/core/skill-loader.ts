import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

export interface SkillEntry {
  name: string;
  description: string;
  triggers: string[];
  category: string;
  priority: string;
  content: string;
  sourcePath: string;
}

export interface SkillRegistry {
  byName: Map<string, SkillEntry>;
  byTrigger: Map<string, SkillEntry[]>;
  all: SkillEntry[];
}

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');

function parseFrontmatter(raw: string): { metadata: Record<string, unknown>; content: string } {
  const lines = raw.split('\n');
  const metadata: Record<string, unknown> = {};
  let contentStart = 0;

  if (lines[0]?.trim() === '---') {
    const end = lines.indexOf('---', 1);
    if (end !== -1) {
      const yamlBlock = lines.slice(1, end).join('\n');
      for (const line of yamlBlock.split('\n')) {
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
          const key = line.slice(0, colonIdx).trim();
          let value: unknown = line.slice(colonIdx + 1).trim();
          if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map((s: string) => s.trim().replace(/['"]/g, ''));
          }
          if (typeof value === 'string' && (value === 'true' || value === 'false')) {
            value = value === 'true';
          }
          metadata[key] = value;
        }
      }
      contentStart = end + 1;
    }
  }

  const meta = metadata.metadata as Record<string, unknown> | undefined;
  const category = (metadata.category as string) || '';
  if (!metadata.category && meta?.category) {
    metadata.category = meta.category as string;
  }

  return {
    metadata,
    content: lines.slice(contentStart).join('\n').trim(),
  };
}

function scanDirectory(skillsDir: string): SkillEntry[] {
  const results: SkillEntry[] = [];
  const dir = join(ROOT, skillsDir);

  if (!existsSync(dir)) return results;

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillPath = join(dir, entry.name, 'SKILL.md');
    if (!existsSync(skillPath)) continue;

    try {
      const raw = readFileSync(skillPath, 'utf-8');
      const { metadata, content } = parseFrontmatter(raw);

      const rawTriggers = metadata.triggers;
      const triggers: string[] = Array.isArray(rawTriggers)
        ? (rawTriggers as string[])
        : typeof rawTriggers === 'string'
          ? [rawTriggers]
          : [];

      const metaObj = metadata.metadata as Record<string, unknown> | undefined;
      results.push({
        name: (metadata.name as string) || entry.name,
        description: (metadata.description as string) || '',
        triggers,
        category: (metadata.category as string) || (metaObj?.category as string) || 'general',
        priority: (metadata.priority as string) || 'medium',
        content,
        sourcePath: skillPath,
      });
    } catch {
      continue;
    }
  }

  return results;
}

export function loadAllSkills(configSearchPaths: string[]): SkillRegistry {
  const all: SkillEntry[] = [];
  const seen = new Set<string>();

  for (const searchPath of configSearchPaths) {
    const skills = scanDirectory(searchPath);
    for (const skill of skills) {
      if (!seen.has(skill.name)) {
        seen.add(skill.name);
        all.push(skill);
      }
    }
  }

  const byName = new Map<string, SkillEntry>();
  const byTrigger = new Map<string, SkillEntry[]>();

  for (const skill of all) {
    byName.set(skill.name, skill);
    for (const trigger of skill.triggers) {
      const existing = byTrigger.get(trigger.toLowerCase()) || [];
      existing.push(skill);
      byTrigger.set(trigger.toLowerCase(), existing);
    }
  }

  return { byName, byTrigger, all };
}

export function getSkillsForFile(
  filePath: string,
  registry: SkillRegistry,
): SkillEntry[] {
  const matched = new Set<string>();
  const result: SkillEntry[] = [];
  const lowerPath = filePath.toLowerCase();

  const FILE_PATTERNS: [RegExp, string[]][] = [
    [/\.tsx$/, ['frontend-design', 'ui-ux-pro-max', 'shadcn-ui-setup']],
    [/\.jsx$/, ['frontend-design', 'ui-ux-pro-max', 'shadcn-ui-setup']],
    [/(components|ui|pages|screens)\//, ['frontend-design', 'ui-ux-pro-max', 'framer-motion-animator']],
    [/(hooks?|utils?|helpers?|lib)\//, ['frontend-architecture']],
    [/animat|motion|transition|gesture/i, ['framer-motion-animator']],
    [/stripe|payment|checkout|pago|price/i, ['stripe-setup']],
    [/clerk|auth|login|signup|usuario|autenticacion/i, ['clerk-setup', 'clerk-react-patterns']],
    [/supabase|neon|postgres|sql|db|database/i, ['neon-postgres']],
    [/api|route|service|endpoint/i, ['api-integration-specialist']],
    [/classroom|curso|course|estudiante/i, ['recipe-create-classroom-course']],
    [/magic/i, ['magic-ui']],
    [/spline|3d|three/i, ['spline-interactive']],
    [/rag|pipeline|research|busqueda/i, ['ai-rag-pipeline']],
    [/agent|swarm|hive/i, ['agency-agents-ai-specialists']],
  ];

  for (const [pattern, skillNames] of FILE_PATTERNS) {
    if (pattern.test(lowerPath)) {
      for (const name of skillNames) {
        if (!matched.has(name)) {
          matched.add(name);
          const skill = registry.byName.get(name);
          if (skill) result.push(skill);
        }
      }
    }
  }

  for (const skill of registry.all) {
    for (const trigger of skill.triggers) {
      if (!matched.has(skill.name) && lowerPath.includes(trigger.toLowerCase())) {
        matched.add(skill.name);
        result.push(skill);
        break;
      }
    }
  }

  if (result.length === 0) {
    const defaultSkill = registry.byName.get('frontend-architecture');
    if (defaultSkill) result.push(defaultSkill);
  }

  return result;
}
