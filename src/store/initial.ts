import type { AppState } from "../types";
export const initialState = (): AppState => ({
  user: null,
  signedOut: false,
  prive: false,
  incognito: false,
  likes: [],
  passes: [],
  received: ["p1", "p2", "p3", "p4", "p7", "p8"],
  matches: ["p5", "p6"],
  blocked: [],
  reports: [],
  trips: [],
  filters: {
    minAge: 18,
    maxAge: 55,
    city: "",
    gender: "Everyone",
    intention: "Any",
  },
  chats: ["p5", "p6"].map((personId, i) => ({
    personId,
    hidden: false,
    messages: [
      {
        id: `seed${i}`,
        text: i
          ? "A tiny jazz café or a walk by the sea — what’s your ideal first meeting?"
          : "Your perfect Sunday sounds a lot like mine. Have a favourite bookshop?",
        outgoing: false,
        at: new Date().toISOString(),
        simulated: true,
      },
    ],
  })),
});
