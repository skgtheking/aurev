import type { AppState } from "../types";
export function reaction(
  state: AppState,
  id: string,
  liked: boolean,
): AppState {
  if (
    state.blocked.includes(id) ||
    (!state.prive &&
      liked &&
      state.likes.length >= 10 &&
      !state.likes.includes(id))
  )
    return state;
  const match = liked && state.received.includes(id);
  return {
    ...state,
    likes: liked ? [...new Set([...state.likes, id])] : state.likes,
    passes: !liked ? [...new Set([...state.passes, id])] : state.passes,
    matches: match ? [...new Set([...state.matches, id])] : state.matches,
    chats:
      match && !state.chats.some((c) => c.personId === id)
        ? [...state.chats, { personId: id, messages: [], hidden: false }]
        : state.chats,
  };
}
export function blockPerson(
  state: AppState,
  id: string,
  reason?: string,
): AppState {
  return {
    ...state,
    blocked: [...new Set([...state.blocked, id])],
    matches: state.matches.filter((x) => x !== id),
    received: state.received.filter((x) => x !== id),
    chats: state.chats.filter((c) => c.personId !== id),
    reports: reason
      ? [
          ...state.reports,
          { personId: id, reason, at: new Date().toISOString() },
        ]
      : state.reports,
  };
}
