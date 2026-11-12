import type { Filters, Person, Trip } from "../types";
export function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(value + "T12:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value
    ? d
    : null;
}
export function age(dob: string, now = new Date()): number {
  const d = parseDate(dob);
  if (!d) return -1;
  return (
    now.getUTCFullYear() -
    d.getUTCFullYear() -
    (now.getUTCMonth() < d.getUTCMonth() ||
    (now.getUTCMonth() === d.getUTCMonth() && now.getUTCDate() < d.getUTCDate())
      ? 1
      : 0)
  );
}
export function adult(dob: string, now = new Date()) {
  const n = age(dob, now);
  return n >= 18 && n <= 120;
}
export function reciprocal(a: Person, b: Person) {
  return a.seeking.includes(b.gender) && b.seeking.includes(a.gender);
}
export function eligible(
  person: Person,
  user: Person,
  filters: Filters,
  blocked: string[],
) {
  const n = age(person.dob);
  return (
    adult(person.dob) &&
    reciprocal(user, person) &&
    !blocked.includes(person.id) &&
    n >= filters.minAge &&
    n <= filters.maxAge &&
    (!filters.city.trim() ||
      person.city.toLowerCase().includes(filters.city.trim().toLowerCase())) &&
    (filters.gender === "Everyone" || person.gender === filters.gender) &&
    (filters.intention === "Any" || (person.intentions?.length ? person.intentions : [person.intention]).includes(filters.intention))
  );
}
export const today = () => new Date().toISOString().slice(0, 10);
export function validateTrip(
  trip: Pick<Trip, "city" | "start" | "end">,
  current = today(),
) {
  if (trip.city.trim().length < 2) return "Enter a destination city in India.";
  if (!parseDate(trip.start) || !parseDate(trip.end))
    return "Use valid dates in YYYY-MM-DD format.";
  if (trip.start < current) return "Your trip must start today or later.";
  if (trip.end < trip.start)
    return "End date must be on or after the start date.";
  return "";
}
export function overlap(a: Trip, b: Trip) {
  return (
    a.optIn &&
    b.optIn &&
    a.city.trim().toLowerCase() === b.city.trim().toLowerCase() &&
    !!parseDate(a.start) &&
    !!parseDate(a.end) &&
    !!parseDate(b.start) &&
    !!parseDate(b.end) &&
    a.start <= a.end &&
    b.start <= b.end &&
    a.start <= b.end &&
    b.start <= a.end
  );
}
const signs = [
  "Capricorn",
  "Aquarius",
  "Pisces",
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
];
export function zodiac(dob: string) {
  const d = parseDate(dob);
  if (!d) return "Unknown";
  const m = d.getUTCMonth();
  return signs[
    m +
      (d.getUTCDate() >= [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22][m]
        ? 1
        : 0)
  ];
}
export function chemistry(a: string, b: string) {
  return `${zodiac(a)} meets ${zodiac(b)}: bring curiosity to your differences and make space for each other’s rhythm. Try a conversation about what makes you feel at home. This is entertainment, not a prediction of compatibility.`;
}
export function validatePerson(p: Person) {
  if (!adult(p.dob))
    return "Aurev is for adults aged 18 and above. Enter a valid date of birth.";
  if (p.name.trim().length < 2 || p.name.trim().length > 40)
    return "Enter a name between 2 and 40 characters.";
  if (p.city.trim().length < 2) return "Enter your city in India.";
  if (!p.seeking.length) return "Choose at least one dating preference.";
  if (p.intentions && !p.intentions.length) return "Choose at least one connection intention.";
  if (p.interests.length < 2) return "Choose at least two interests.";
  if (p.bio.trim().length < 20)
    return "Tell us about yourself in at least 20 characters.";
  if (p.answer.trim().length < 5)
    return "Add a prompt answer of at least 5 characters.";
  if (!p.photos.length) return "Choose a portrait style or add a photo.";
  return "";
}
