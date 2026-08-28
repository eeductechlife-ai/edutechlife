import { FEATURE_FLAGS } from "../components/kids-dashboard/kidsDashboardConfig";

/**
 * Resolves a SmartBoard 3.0 feature flag.
 *
 * Override order (highest first):
 *   1. Per-session localStorage override — `sb_flag_<name>` = "true" | "false"
 *      (enables progressive rollout / QA toggling without a redeploy).
 *   2. FEATURE_FLAGS config default (reflects what has shipped).
 *
 * Supabase per-user flags can layer in later by seeding the localStorage
 * override at login; this keeps the read path synchronous for render.
 *
 * @param {string} flagName - Key from FEATURE_FLAGS
 * @returns {boolean}
 */
export function isFeatureEnabled(flagName) {
  try {
    const override = localStorage.getItem(`sb_flag_${flagName}`);
    if (override === "true") return true;
    if (override === "false") return false;
  } catch {
    // localStorage unavailable — fall through to config
  }
  return FEATURE_FLAGS[flagName] ?? false;
}

export function useFeatureFlag(flagName) {
  return isFeatureEnabled(flagName);
}
