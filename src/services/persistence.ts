import type { AppState, Person } from "../types";
export const STORAGE_KEY = "aurev.demo.v1";
export function encode(state: AppState) {
  return JSON.stringify({ version: 1, state });
}
type RecordValue = Record<string, unknown>;
const record = (v: unknown): v is RecordValue =>
  !!v && typeof v === "object" && !Array.isArray(v);
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");
function person(v: unknown): v is Person {
  if (!record(v)) return false;
  return (
    [
      "id",
      "name",
      "dob",
      "gender",
      "pronouns",
      "orientation",
      "city",
      "intention",
      "bio",
      "prompt",
      "answer",
    ].every((k) => typeof v[k] === "string") &&
    strings(v.seeking) &&
    strings(v.photos) &&
    strings(v.interests) &&
    typeof v.astrology === "boolean" &&
    typeof v.traveler === "boolean"
  );
}
export function decode(raw: string | null, fallback: AppState): AppState {
  if (!raw) return fallback;
  try {
    const x: unknown = JSON.parse(raw);
    if (!record(x) || x.version !== 1 || !record(x.state)) return fallback;
    const v = x.state;
    for (const k of ["likes", "passes", "received", "matches", "blocked"])
      if (!strings(v[k])) return fallback;
    if (
      !["signedOut", "prive", "incognito"].every(
        (k) => typeof v[k] === "boolean",
      )
    )
      return fallback;
    if (v.user !== null && !person(v.user)) return fallback;
    if (
      !Array.isArray(v.chats) ||
      !v.chats.every(
        (c) =>
          record(c) &&
          typeof c.personId === "string" &&
          typeof c.hidden === "boolean" &&
          Array.isArray(c.messages) &&
          c.messages.every(
            (m: unknown) =>
              record(m) &&
              typeof m.id === "string" &&
              typeof m.text === "string" &&
              typeof m.outgoing === "boolean" &&
              typeof m.at === "string",
          ),
      )
    )
      return fallback;
    if (
      !Array.isArray(v.trips) ||
      !v.trips.every(
        (t) =>
          record(t) &&
          ["id", "city", "start", "end"].every(
            (k) => typeof t[k] === "string",
          ) &&
          typeof t.optIn === "boolean",
      )
    )
      return fallback;
    if (
      !Array.isArray(v.reports) ||
      !v.reports.every(
        (t) =>
          record(t) &&
          ["personId", "reason", "at"].every((k) => typeof t[k] === "string"),
      )
    )
      return fallback;
    const f = v.filters;
    if (
      !record(f) ||
      !Number.isInteger(f.minAge) ||
      !Number.isInteger(f.maxAge) ||
      Number(f.minAge) < 18 ||
      Number(f.maxAge) > 120 ||
      Number(f.minAge) > Number(f.maxAge) ||
      typeof f.city !== "string" ||
      !["Everyone", "Woman", "Man", "Non-binary"].includes(String(f.gender)) ||
      !["Any", "Life partner", "Long-term", "Exploring", "Casual dating", "Short-term dating", "Long-term relationship", "New friendships", "Platonic connections", "Still figuring it out", "Open to marriage"].includes(
        String(f.intention),
      )
    )
      return fallback;
    // Migrate v0.1 data without discarding saved chats, matches or likes.
    const legacy: Record<string, string> = {
      "Life partner": "Open to marriage",
      "Long-term": "Long-term relationship",
      "Exploring": "Still figuring it out",
    };
    const migrate = (value: string) => legacy[value] || value;
    if (v.user && record(v.user)) {
      v.user.intention = migrate(String(v.user.intention));
      const choices = Array.isArray(v.user.intentions)
        ? v.user.intentions.filter((x): x is string => typeof x === "string")
        : [String(v.user.intention)];
      v.user.intentions = [...new Set(choices.map(migrate))];
      if (!v.user.intentions.length) v.user.intentions = [String(v.user.intention)];
      v.user.intention = v.user.intentions[0];
    }
    if (record(v.filters)) v.filters.intention = migrate(String(v.filters.intention));
    if (!record(v.dailyLikes) || typeof v.dailyLikes.date !== "string" || !strings(v.dailyLikes.ids)) {
      v.dailyLikes = { date: "", ids: [] };
    }
    return v as unknown as AppState;
  } catch {
    return fallback;
  }
}

/** Serialize writes so a slow older snapshot cannot overwrite a newer one. */
export function createPersistor(storage: {
  setItem: (key: string, value: string) => Promise<void>;
}) {
  let pending = Promise.resolve();
  return (state: AppState) => {
    const snapshot = encode(state);
    const job = pending.then(() => storage.setItem(STORAGE_KEY, snapshot));
    pending = job.catch(() => {});
    return job;
  };
}
