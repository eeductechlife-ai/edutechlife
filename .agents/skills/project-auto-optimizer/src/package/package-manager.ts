import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');

export interface DependencyCheck {
  packageName: string;
  isInstalled: boolean;
  projectPath: string;
}

export function checkDependency(packageName: string, projectPackageJson: string): boolean {
  const pkgPath = resolve(ROOT, projectPackageJson);
  if (!existsSync(pkgPath)) return false;

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.peerDependencies || {}),
    };
    return packageName in allDeps;
  } catch {
    return false;
  }
}

export function checkDependencies(
  packages: string[],
  projectPackageJson: string,
): DependencyCheck[] {
  return packages.map((pkg) => ({
    packageName: pkg,
    isInstalled: checkDependency(pkg, projectPackageJson),
    projectPath: projectPackageJson,
  }));
}

export function installDependency(packageName: string, cwd: string): boolean {
  const fullPath = resolve(ROOT, cwd);

  if (!existsSync(resolve(fullPath, 'package.json'))) {
    return false;
  }

  try {
    const output = execSync(`npm install ${packageName}`, {
      cwd: fullPath,
      timeout: 120_000,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });
    return true;
  } catch {
    return false;
  }
}

export function installMissingDependencies(
  requiredPackages: string[],
  projectPackageJson: string,
  cwd: string,
): { installed: string[]; failed: string[]; skipped: string[] } {
  const installed: string[] = [];
  const failed: string[] = [];
  const skipped: string[] = [];

  for (const pkg of requiredPackages) {
    if (checkDependency(pkg, projectPackageJson)) {
      skipped.push(pkg);
      continue;
    }

    const success = installDependency(pkg, cwd);
    if (success) {
      installed.push(pkg);
    } else {
      failed.push(pkg);
    }
  }

  return { installed, failed, skipped };
}
