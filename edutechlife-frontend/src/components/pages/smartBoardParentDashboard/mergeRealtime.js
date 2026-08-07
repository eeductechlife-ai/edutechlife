const seenIds = new Set();

export const dedupeById = (items) => {
  const out = [];
  const seen = new Set();
  for (const item of items) {
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
};

export const mergeRealtimePoints = (current, livePoints) => {
  const history = dedupeById([...current.history, ...livePoints]).slice(0, 100);
  const newlySeen = livePoints.filter((p) => p && !seenIds.has(p.id));
  newlySeen.forEach((p) => seenIds.add(p.id));
  const points =
    current.points + newlySeen.reduce((s, p) => s + (p.points || 0), 0);
  return { points, history };
};

export const resetSeenIds = () => seenIds.clear();
