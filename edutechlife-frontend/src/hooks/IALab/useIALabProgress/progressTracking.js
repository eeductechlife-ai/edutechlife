import { countModuleResources } from "./progressCalculations";

export async function trackResourceViewed(moduleId, resourceId, resourceType, user, progressService, updateModuleActivity) {
  if (!user?.id) return { success: false, error: "Usuario no autenticado" };
  if (!progressService) return { success: false, error: "Servicio no disponible" };
  try {
    const total = countModuleResources(moduleId);
    const result = await progressService.saveResourceViewed(
      moduleId,
      resourceId,
      resourceType,
      total,
      user.id,
    );
    if (result.success) {
      if (result.viewedCount >= total) {
        updateModuleActivity(moduleId, "resourcesCompleted", true);
      }
    } else {
      updateModuleActivity(moduleId, "resourcesCompleted", true);
    }
    return result;
  } catch (error) {
    console.error("Error tracking resource:", error);
    return { success: false, error: error.message };
  }
}

export async function trackExamResult(moduleId, score, passed, user, progressService, updateModuleActivity) {
  if (!user?.id) return { success: false, error: "Usuario no autenticado" };
  if (!progressService) return { success: false, error: "Servicio no disponible" };
  updateModuleActivity(moduleId, "exam", score >= 80, score);
  try {
    const result = await progressService.saveExamProgress(
      moduleId,
      score,
      passed,
      user.id,
    );
    return result;
  } catch (error) {
    console.error("Error tracking exam:", error);
    return { success: true, local: true };
  }
}

export async function trackChallengeResult(moduleId, score, user, progressService, updateModuleActivity) {
  if (!user?.id) return { success: false, error: "Usuario no autenticado" };
  if (!progressService) return { success: false, error: "Servicio no disponible" };
  updateModuleActivity(moduleId, "challenge", score >= 80, score);
  try {
    const result = await progressService.saveChallengeProgress(
      moduleId,
      score,
      user.id,
    );
    return result;
  } catch (error) {
    console.error("Error tracking challenge:", error);
    return { success: true, local: true };
  }
}

export async function trackCommunityComment(moduleId, user, progressService, updateModuleActivity) {
  if (!user?.id) return { success: false, error: "Usuario no autenticado" };
  if (!progressService) return { success: false, error: "Servicio no disponible" };
  updateModuleActivity(moduleId, "community", true);
  try {
    const result = await progressService.saveCommunityProgress(
      moduleId,
      user.id,
    );
    return result;
  } catch (error) {
    console.error("Error tracking community:", error);
    return { success: true, local: true };
  }
}

export async function loadModuleBreakdown(moduleId, user, progressService) {
  if (!user?.id) return null;
  if (!progressService) return null;
  try {
    return await progressService.getModuleBreakdown(moduleId, user.id);
  } catch (error) {
    console.error("Error loading module breakdown:", error);
    return null;
  }
}
