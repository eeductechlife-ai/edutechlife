import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');

export interface ValidationResult {
  success: boolean;
  failedCommand: string | null;
  output: string;
  error: string | null;
}

export interface ValidationCommand {
  name: string;
  cmd: string;
  cwd: string;
}

function runCommand(cmd: string, cwd: string): ValidationResult {
  const fullPath = resolve(ROOT, cwd);

  try {
    const output = execSync(cmd, {
      cwd: fullPath,
      timeout: 120_000,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });

    return {
      success: true,
      failedCommand: null,
      output: output?.trim() || '',
      error: null,
    };
  } catch (err) {
    const error = err as Error & { stdout?: string; stderr?: string };
    return {
      success: false,
      failedCommand: cmd,
      output: error.stdout?.toString()?.trim() || '',
      error: error.stderr?.toString()?.trim() || error.message,
    };
  }
}

export function runProjectValidators(commands: ValidationCommand[]): ValidationResult {
  for (const cmd of commands) {
    const result = runCommand(cmd.cmd, cmd.cwd);
    if (!result.success) {
      return result;
    }
  }

  return {
    success: true,
    failedCommand: null,
    output: 'All validators passed',
    error: null,
  };
}

export function runValidatorsForProjects(
  projectCommands: Map<string, ValidationCommand[]>,
): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>();

  for (const [projectName, commands] of projectCommands) {
    const result = runProjectValidators(commands);
    results.set(projectName, result);
  }

  return results;
}
