import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import * as gitManager from '../git/git-manager.js';
import * as logger from '../logger/logger.js';
import { TortugaStats } from '../logger/logger.js';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');

const docsDir = resolve(ROOT, 'docs', 'tortuga', 'vaults');

export interface VaultResult {
  tag: string;
  recoveryBranch: string;
  success: boolean;
}

export async function createVault(stats: TortugaStats): Promise<VaultResult> {
  logger.logPhase('FASE 0', 'VAULT — Creando punto de recuperación');

  const clean = await gitManager.ensureCleanRepository();
  if (!clean) {
    return { tag: '', recoveryBranch: '', success: false };
  }

  try {
    const tag = await gitManager.createVaultTag();
    stats.vaultTag = tag;

    const recoveryBranch = await gitManager.createRecoveryBranch();
    stats.recoveryBranch = recoveryBranch;

    if (!existsSync(docsDir)) {
      mkdirSync(docsDir, { recursive: true });
    }

    const vaultRecord = `Vault: ${tag}
Date: ${new Date().toISOString()}
Branch: ${recoveryBranch}
Status: Pre-modification snapshot
`;
    const vaultPath = resolve(docsDir, `${tag.replace(/[/:]/g, '-')}.vault`);
    writeFileSync(vaultPath, vaultRecord, 'utf-8');

    logger.logSuccess(`Vault creado: ${tag}`);
    logger.logSuccess(`Recovery branch: ${recoveryBranch}`);
    logger.logDim(`Para restaurar: git checkout ${tag}`);

    return { tag, recoveryBranch, success: true };
  } catch (err) {
    logger.logError(`Error creando vault: ${err}`);
    return { tag: '', recoveryBranch: '', success: false };
  }
}
