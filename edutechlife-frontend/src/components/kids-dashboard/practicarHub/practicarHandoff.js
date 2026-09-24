// Passes the subject chosen in Practicar to the tool the student opens next.
export const HANDOFF_CHALLENGE_SUBJECT = "practicar_challenge_subject";
export const HANDOFF_FLASHCARDS_TOPIC = "practicar_flashcards_topic";
export const HANDOFF_PRACTICAR_SUBJECT = "practicar_selected_subject";

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
