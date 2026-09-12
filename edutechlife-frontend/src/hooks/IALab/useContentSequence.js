/**
 * useContentSequence — Secuencia de contenidos de un módulo IALab.
 *
 * Fuente de verdad: la lista plana de recursos vistos
 * (`ialab_viewed_resources`, gestionada por el store). A partir de ella
 * calcula, para el módulo activo:
 *
 *   - `viewedIds`: ids de recursos vistos (reactivo a `_viewedResourcesVersion`).
 *   - `topics`: temas en orden, con `isCompleted` (todos sus recursos vistos)
 *     e `isUnlocked` (el tema 0 siempre; el resto cuando el anterior está
 *     completo).
 *   - `firstUnviewedFlat`: índice del primer recurso del módulo sin ver.
 *   - `isResourceLocked(resourceId)`: un recurso está bloqueado si hay algún
 *     recurso anterior del módulo sin ver.
 *   - `allTopicsCompleted`: todos los temas del módulo están completos.
 *
 * Reglas (secuencia pedida):
 *   contenido visto → marca verde y habilita el siguiente contenido;
 *   tema completo     → habilita (y auto-avanza a) el siguiente tema.
 *
 * Fail-open: un recurso/tema que no pertenece al módulo activo nunca se
 * bloquea, para no dejar al usuario en un callejón sin salida.
 */
import { useCallback, useMemo } from "react";
import { useIALabStore } from "../../store/ialabStore";
import { getModuleOverviewData } from "../../components/IALab/constants/moduleContent/selectors";
import { getResourcesForTopic } from "../../components/IALab/constants/moduleResources";

export function useContentSequence(activeMod, locale = "es") {
  const viewedVersion = useIALabStore((s) => s._viewedResourcesVersion);

  const viewedIds = useMemo(
    () => useIALabStore.getState().getViewedResources(),
    [viewedVersion],
  );

  const topics = useMemo(() => {
    const overview = getModuleOverviewData(activeMod, locale);
    return (overview?.topics || []).map((topic, index) => {
      const topicData = getResourcesForTopic(topic.title, locale);
      const resources = topicData?.resources || [];
      return {
        index,
        title: topic.title,
        duration: topic.duration,
        resources,
        resourceIds: resources.map((r) => r.id),
      };
    });
  }, [activeMod, locale]);

  const orderedResourceIds = useMemo(
    () => topics.flatMap((t) => t.resourceIds),
    [topics],
  );

  // Índice del primer recurso del módulo sin ver. -1 = todo visto.
  const firstUnviewedFlat = useMemo(
    () => orderedResourceIds.findIndex((id) => !viewedIds.includes(id)),
    [orderedResourceIds, viewedIds],
  );

  const topicsState = useMemo(() => {
    return topics.map((topic) => {
      const isCompleted =
        topic.resourceIds.length > 0 &&
        topic.resourceIds.every((id) => viewedIds.includes(id));
      const firstFlat = orderedResourceIds.indexOf(topic.resourceIds[0]);
      // Desbloqueado si ya está completo, si no hay pendientes, o si no hay
      // ningún recurso anterior sin ver.
      const isUnlocked =
        isCompleted ||
        firstUnviewedFlat === -1 ||
        firstFlat === -1 ||
        firstFlat <= firstUnviewedFlat;
      return { ...topic, isCompleted, isUnlocked };
    });
  }, [topics, viewedIds, firstUnviewedFlat, orderedResourceIds]);

  const allTopicsCompleted = useMemo(
    () => topicsState.length > 0 && topicsState.every((t) => t.isCompleted),
    [topicsState],
  );

  const isResourceLocked = useCallback(
    (resourceId) => {
      if (viewedIds.includes(resourceId)) return false;
      const flatIdx = orderedResourceIds.indexOf(resourceId);
      if (flatIdx === -1) return false; // no pertenece al módulo → fail-open
      if (firstUnviewedFlat === -1) return false;
      return flatIdx > firstUnviewedFlat;
    },
    [viewedIds, orderedResourceIds, firstUnviewedFlat],
  );

  const isTopicCompleted = useCallback(
    (topicIndex) => !!topicsState[topicIndex]?.isCompleted,
    [topicsState],
  );

  return {
    viewedIds,
    topics: topicsState,
    orderedResourceIds,
    firstUnviewedFlat,
    allTopicsCompleted,
    isResourceLocked,
    isTopicCompleted,
  };
}

export default useContentSequence;
