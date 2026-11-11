export type Gender = "Woman" | "Man" | "Non-binary";
export type Intention = "Life partner" | "Long-term" | "Exploring";
export interface Person {
  id: string;
  name: string;
  dob: string;
  gender: Gender;
  pronouns: string;
  orientation: string;
  seeking: Gender[];
  city: string;
  intention: Intention;
  interests: string[];
  bio: string;
  prompt: string;
  answer: string;
  photos: string[];
  astrology: boolean;
  traveler: boolean;
}
export interface Filters {
  minAge: number;
  maxAge: number;
  city: string;
  gender: Gender | "Everyone";
  intention: Intention | "Any";
}
export interface Trip {
  id: string;
  city: string;
  start: string;
  end: string;
  optIn: boolean;
}
export interface Message {
  id: string;
  text: string;
  outgoing: boolean;
  at: string;
  simulated?: boolean;
}
export interface Conversation {
  personId: string;
  messages: Message[];
  hidden: boolean;
}
export interface Report {
  personId: string;
  reason: string;
  at: string;
}
export interface AppState {
  user: Person | null;
  signedOut: boolean;
  prive: boolean;
  incognito: boolean;
  likes: string[];
  passes: string[];
  received: string[];
  matches: string[];
  blocked: string[];
  reports: Report[];
  chats: Conversation[];
  trips: Trip[];
  filters: Filters;
}
