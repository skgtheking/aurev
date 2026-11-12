import type { AppState } from "../types";
export const DAILY_LIKE_LIMIT = 10;
/** Local date so a new allowance begins at the user's local midnight. */
export function localDay(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
export function dailyLikeCount(state: AppState, now: Date = new Date()) {
  return state.dailyLikes?.date === localDay(now) ? state.dailyLikes.ids.length : 0;
}
export function canLike(state: AppState, id: string, now: Date = new Date()) {
  return !state.blocked.includes(id) &&
    (state.likes.includes(id) || state.prive || dailyLikeCount(state, now) < DAILY_LIKE_LIMIT);
}
export function reaction(
  state: AppState,
  id: string,
  liked: boolean,
  now: Date = new Date(),
): AppState {
  if (state.blocked.includes(id) || (liked && !canLike(state, id, now))) return state;
  if (liked && state.likes.includes(id)) return state;
  if (!liked && state.passes.includes(id)) return state;
  const match = liked && state.received.includes(id);
  const day = localDay(now);
  const previous = state.dailyLikes?.date === day ? state.dailyLikes.ids : [];
  return {
    ...state,
    dailyLikes: liked && !state.prive
      ? { date: day, ids: [...new Set([...previous, id])] }
      : state.dailyLikes,
    likes: liked ? [...new Set([...state.likes, id])] : state.likes,
    passes: !liked ? [...new Set([...state.passes, id])] : state.passes,
    matches: match ? [...new Set([...state.matches, id])] : state.matches,
    chats:
      match && !state.chats.some((c) => c.personId === id)
        ? [...state.chats, { personId: id, messages: [], hidden: false }]
        : state.chats,
  };
}
export function blockPerson(state: AppState, id: string, reason?: string): AppState {
  return {
    ...state,
    blocked: [...new Set([...state.blocked, id])],
    matches: state.matches.filter((x) => x !== id),
    received: state.received.filter((x) => x !== id),
    chats: state.chats.filter((c) => c.personId !== id),
    reports: reason
      ? [...state.reports, { personId: id, reason, at: new Date().toISOString() }]
      : state.reports,
  };
}
