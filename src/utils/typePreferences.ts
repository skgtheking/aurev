/** Aurev preferences are self-described; never a safety or compatibility score. */
export const TYPE_OPTIONS = [
  "Emotionally available", "Green flag energy", "Red flag energy",
  "Baddie energy", "Safe space", "Good communicator", "Adventurous",
  "Loyal", "Ambitious", "Funny", "Playful & flirty",
  "Great listener", "Kinky", "Thoughtful", "Independent", "Spontaneous",
] as const;
const PRIVATE_TRAITS = new Set(["Kinky"]);
export function publicTypePreferences(items: readonly string[]): string[] {
  return items.filter((item) => !PRIVATE_TRAITS.has(item));
}
export function normalizeTypeChoices(choices: readonly string[], dealbreakers: readonly string[]) {
  const selected = [...new Set(choices)].filter((x) => TYPE_OPTIONS.some((option) => option === x));
  const required = [...new Set(dealbreakers)].filter((x) => selected.includes(x));
  return { selected, required };
}
