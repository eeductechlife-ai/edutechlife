/**
 * Dani's long-term memory about a student.
 *
 * The model may append `<memoria>{...}</memoria>` to a reply. The tag is
 * removed from the stream before it reaches the student (and the voice), and
 * its content is merged into the `dani_memory` row that the orchestrator
 * reads on the next turn.
 */

const OPEN = '<memoria>';
const CLOSE = '</memoria>';
const MAX_ITEMS = 8;
const MAX_ITEM_CHARS = 60;
const STYLES = ['shy', 'direct', 'playful', 'curious'];

// Stateful filter: returns only the visible part of each streamed chunk.
// Holds back a trailing fragment that could be the start of the tag, since
// the tag can arrive split across chunks ("<mem" + "oria>").
function createMemoriaFilter() {
  let hidden = false;
  let pending = '';
  let memBuf = '';

  return {
    push(chunk) {
      if (hidden) {
        memBuf += chunk;
        return '';
      }
      const text = pending + chunk;
      const idx = text.indexOf(OPEN);
      if (idx >= 0) {
        hidden = true;
        memBuf = text.slice(idx + OPEN.length);
        pending = '';
        return text.slice(0, idx);
      }
      for (let k = Math.min(OPEN.length - 1, text.length); k > 0; k--) {
        if (OPEN.startsWith(text.slice(-k))) {
          pending = text.slice(-k);
          return text.slice(0, -k);
        }
      }
      pending = '';
      return text;
    },
    flush() {
      const out = hidden ? '' : pending;
      pending = '';
      return out;
    },
    memoria() {
      return hidden ? memBuf.split(CLOSE)[0].trim() : '';
    },
  };
}

const cleanList = (v) =>
  (Array.isArray(v) ? v : [])
    .filter((x) => typeof x === 'string')
    .map((x) => x.trim().slice(0, MAX_ITEM_CHARS))
    .filter(Boolean);

// Model output → column-shaped partial update; null when unusable.
function parseMemoria(raw) {
  if (!raw) return null;
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      obj = JSON.parse(m[0]);
    } catch {
      return null;
    }
  }
  if (!obj || typeof obj !== 'object') return null;
  const update = {
    interests: cleanList(obj.intereses),
    strengths: cleanList(obj.fortalezas),
    weaknesses: cleanList(obj.dificultades),
    frequent_errors: cleanList(obj.errores),
    pending_topics: cleanList(obj.pendientes),
    communication_style: STYLES.includes(obj.estilo) ? obj.estilo : null,
  };
  const hasData =
    update.communication_style ||
    ['interests', 'strengths', 'weaknesses', 'frequent_errors', 'pending_topics'].some(
      (k) => update[k].length
    );
  return hasData ? update : null;
}

// Newest items first, case-insensitive dedupe, capped.
function mergeList(current = [], incoming = []) {
  const seen = new Set();
  const out = [];
  for (const item of [...incoming, ...current]) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length === MAX_ITEMS) break;
  }
  return out;
}

/**
 * Builds the row to upsert, or null when nothing changed.
 * @param {object|null} memory current memory as loaded by the orchestrator
 * @param {object|null} update result of parseMemoria
 * @param {string} mood detected emotional state of this turn
 */
function buildMemoryRow(studentId, memory, update, mood) {
  const moodChanged = mood && mood !== 'neutral' && mood !== memory?.lastMood;
  if (!update && !moodChanged) return null;
  const m = memory || {};
  return {
    student_id: studentId,
    interests: mergeList(m.interests, update?.interests),
    strengths: mergeList(m.strengths, update?.strengths),
    weaknesses: mergeList(m.weaknesses, update?.weaknesses),
    frequent_errors: mergeList(m.frequentErrors, update?.frequent_errors),
    pending_topics: mergeList(m.pendingTopics, update?.pending_topics),
    communication_style: update?.communication_style || m.communicationStyle || null,
    last_mood: moodChanged ? mood : m.lastMood || null,
    last_updated: new Date().toISOString(),
  };
}

async function saveDaniMemory(supabase, row) {
  if (!row) return;
  const { error } = await supabase.from('dani_memory').upsert(row, { onConflict: 'student_id' });
  // 42P01: table not created in this environment yet.
  if (error && error.code !== '42P01') {
    console.error('[daniMemory] save failed:', error.message);
  }
}

module.exports = {
  createMemoriaFilter,
  parseMemoria,
  mergeList,
  buildMemoryRow,
  saveDaniMemory,
};
