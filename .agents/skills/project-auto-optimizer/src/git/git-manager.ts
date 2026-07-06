import simpleGit from 'simple-git';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');
const git = simpleGit(ROOT);

function timestamp(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}-${h}${min}`;
}

function humanDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function ensureCleanRepository(): Promise<boolean> {
  const status = await git.status();
  if (!status.isClean()) {
    console.error('\n❌ Tortuga: El repositorio tiene cambios sin guardar.');
    console.error('   Ejecuta `git stash` o commit tus cambios antes de continuar.\n');
    return false;
  }
  console.log('   ✓ Repositorio limpio');
  return true;
}

export async function createVaultTag(): Promise<string> {
  const tag = `tortuga/vault/${timestamp()}`;
  try {
    await git.addTag(tag);
    console.log(`   ✓ Vault tag creado: ${tag}`);
    return tag;
  } catch (err) {
    console.error(`   ✗ Error creando vault tag: ${err}`);
    throw err;
  }
}

export async function createRecoveryBranch(): Promise<string> {
  const branch = `tortuga/recovery-${humanDate()}`;
  try {
    const branches = await git.branch();
    if (!branches.all.includes(branch)) {
      await git.branch([branch]);
      console.log(`   ✓ Recovery branch creada: ${branch}`);
    } else {
      console.log(`   → Recovery branch ya existe: ${branch}`);
    }
    return branch;
  } catch (err) {
    console.error(`   ✗ Error creando recovery branch: ${err}`);
    throw err;
  }
}

export async function createOptimizationBranch(): Promise<string> {
  const branch = `tortuga/optimization/${timestamp()}`;
  try {
    await git.checkoutLocalBranch(branch);
    console.log(`   ✓ Branch de trabajo: ${branch}`);
    return branch;
  } catch (err) {
    console.error(`   ✗ Error creando optimization branch: ${err}`);
    throw err;
  }
}

export async function commitFile(
  filePath: string,
  skills: string[],
  deps: string[],
  improvementType: string,
): Promise<boolean> {
  const relativePath = filePath.replace(ROOT + '/', '');
  const message = [
    `agent(tortuga): optimize ${relativePath}`,
    `Skills: ${skills.join(', ')}`,
    improvementType ? `Improvement: ${improvementType}` : '',
    deps.length > 0 ? `Dependencies: ${deps.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await git.add(relativePath);
    await git.commit(message);
    console.log(`   ✓ Commit: ${relativePath}`);
    return true;
  } catch (err) {
    console.error(`   ✗ Error committing ${relativePath}: ${err}`);
    return false;
  }
}

export async function revertFile(filePath: string, originalContent: string): Promise<boolean> {
  try {
    await git.checkout([filePath]);
    console.log(`   ↩ Revertido: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`   ✗ Error revirtiendo ${filePath}: ${err}`);
    return false;
  }
}

export async function cleanupBranch(branchName: string): Promise<void> {
  try {
    await git.checkout('main');
    await git.deleteLocalBranch(branchName, true);
    console.log(`   ✓ Branch eliminada: ${branchName}`);
  } catch (err) {
    console.error(`   ✗ Error cleanup branch: ${err}`);
  }
}

export async function getCurrentBranch(): Promise<string> {
  return (await git.branch()).current;
}
