// Passes the subject chosen in Practicar to the tool the student opens next.
export const HANDOFF_CHALLENGE_SUBJECT = "practicar_challenge_subject";
export const HANDOFF_FLASHCARDS_TOPIC = "practicar_flashcards_topic";
export const HANDOFF_PRACTICAR_SUBJECT = "practicar_selected_subject";
// Id of a deck EduCards should open straight into study mode.
export const HANDOFF_FLASHCARDS_DECK = "practicar_flashcards_deck";
// A "Mi Plan" activity to do now (JSON: route + where it sits in the plan).
export const HANDOFF_PLAN_ACTIVITY = "practicar_plan_activity";
// A plan task handed to Retos / EduCards, ticked when that session ends.
export const HANDOFF_PLAN_PENDING = "practicar_plan_pending";

/** Takes (and clears) the pending plan task if it belongs to `tool`. */
export function takePendingPlanTask(tool) {
  try {
    const task = JSON.parse(peekHandoff(HANDOFF_PLAN_PENDING) || "null");
    if (!task || task.tool !== tool || !task.planRef) return null;
    clearHandoff(HANDOFF_PLAN_PENDING);
    return task;
  } catch {
    return null;
  }
}

export function setHandoff(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode)
  }
}

export function peekHandoff(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function clearHandoff(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // storage unavailable (private mode)
  }
}
