/**
 * Hand-off from the goal console to the enquiry form (no backend: it only pre-fills the form).
 * The console stores the chosen goal; the form reads it on mount and listens for changes.
 */
export const GOAL_EVENT = "viva:goal";
const KEY = "viva-goal";

export function setGoalPrefill(goal: string) {
  try {
    sessionStorage.setItem(KEY, goal);
  } catch {
    /* storage unavailable: the event still carries it */
  }
  window.dispatchEvent(new CustomEvent(GOAL_EVENT, { detail: goal }));
}

export function getGoalPrefill(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}
