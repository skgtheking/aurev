import type { Gender, Person, Trip } from "../types";
const names = [
  "Ananya",
  "Kabir",
  "Meera",
  "Arjun",
  "Isha",
  "Rohan",
  "Aarav",
  "Zoya",
  "Dev",
  "Tara",
  "Ishaan",
  "Noor",
  "Kavya",
  "Rishi",
  "Aditi",
  "Neil",
  "Sana",
  "Vivaan",
  "Diya",
  "Rehan",
  "Avni",
  "Samar",
  "Maya",
  "Aditya",
  "Kiara",
  "Aadi",
  "Leela",
  "Farhan",
  "Naina",
  "Arya",
];
export const cities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Kochi",
  "Ahmedabad",
  "Chandigarh",
  "Goa",
  "Lucknow",
  "Indore",
  "Guwahati",
];
export const interests = [
  "Gym & fitness",
  "Shopping",
  "Kayaking",
  "Cars & motorsports",
  "Raves & festivals",
  "Nightlife",
  "Gaming",
  "Spontaneous trips",
  "Adventure sports",
  "Cocktails",
  "Dancing",
  "Beach holidays",
  "Trekking",
  "Karaoke",
  "Street food",
  "Swimming",
  "Running",
  "Cycling",
  "Badminton",
  "Football",
  "Cricket",
  "Pilates",
  "Fashion",
  "Concerts",
  "Art & galleries",
  "Slow travel",
  "Coffee",
  "Live music",
  "Books",
  "Food trails",
  "Hiking",
  "Cinema",
  "Design",
  "Yoga",
  "Photography",
  "Cooking",
];
export const genders: Gender[] = ["Woman", "Man", "Non-binary"];
export const intentions = [
  "Casual dating", "Short-term dating", "Long-term relationship",
  "New friendships", "Platonic connections", "Still figuring it out", "Open to marriage",
] as const;
export const profiles: Person[] = names.map((name, i) => ({
  id: `p${i + 1}`,
  name,
  dob: `${1991 + (i % 10)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 25) + 1).padStart(2, "0")}`,
  gender:
    i === 6 || i === 11 || i === 25 || i === 29
      ? "Non-binary"
      : i % 2 === 0
        ? "Woman"
        : "Man",
  pronouns:
    i === 6 || i === 11 || i === 25 || i === 29
      ? "they/them"
      : i % 2 === 0
        ? "she/her"
        : "he/him",
  orientation: ["Queer", "Bisexual", "Pansexual"][i % 3],
  seeking: [...genders],
  city: cities[i % cities.length],
  intention: intentions[i % intentions.length],
  intentions: [intentions[i % intentions.length]],
  interests: [
    interests[i % interests.length],
    interests[(i + 7) % interests.length],
    interests[(i + 15) % interests.length],
  ],
  bio: [
    "Collecting little stories, long lunches and places with a view. Looking for someone who makes ordinary Sundays feel extraordinary.",
    "Equal parts ambitious and unhurried. Usually planning my next train journey, discovering a tiny café, or getting lost in a good book.",
    "A creative soul with a soft spot for old cities and new beginnings. I believe the best connections start with a little curiosity.",
    "Happiest around a dinner table with interesting people. Let’s trade playlists, wander through a gallery, and see where the evening goes.",
  ][i % 4],
  prompt: [
    "My idea of a perfect Sunday",
    "A little thing I love",
    "Let’s skip small talk and",
    "My most spontaneous adventure",
  ][i % 4],
  answer: [
    "A slow coffee, a bookshop detour, and absolutely no plans after lunch.",
    "The first rain, handwritten notes, and someone remembering my coffee order.",
    "Tell me about a place that changed how you see the world.",
    "Taking an overnight train to see the sunrise in a city I’d never visited.",
  ][i % 4],
  photos: [`portrait:${i % 6}`],
  astrology: i % 3 !== 1,
  traveler: i % 4 !== 0,
}));
export function fixtureTrips(): Record<string, Trip[]> {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 7);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);
  return Object.fromEntries(
    profiles.map((p, i) => [
      p.id,
      [
        {
          id: `fixture-${p.id}`,
          city: ["Goa", "Jaipur", "Kochi", "Mumbai", "Bengaluru"][i % 5],
          start: start.toISOString().slice(0, 10),
          end: end.toISOString().slice(0, 10),
          optIn: p.traveler,
        },
      ],
    ]),
  );
}
export const blankUser: Person = {
  id: "me",
  name: "",
  dob: "",
  gender: "Woman",
  pronouns: "she/her",
  orientation: "Prefer not to say",
  seeking: ["Man"],
  city: "",
  intention: "Long-term relationship",
  intentions: ["Long-term relationship"],
  interests: [],
  bio: "",
  prompt: "My idea of a perfect Sunday",
  answer: "",
  photos: ["portrait:0"],
  astrology: false,
  traveler: false,
};
export const demoUser: Person = {
  ...blankUser,
  name: "Aarya",
  dob: "1998-05-16",
  city: "Mumbai",
  seeking: [...genders],
  interests: ["Art & galleries", "Slow travel", "Coffee"],
  bio: "Design lover. Weekend wanderer. Always curious about the stories behind the people I meet.",
  answer: "A seaside walk, a little jazz, and a table for two.",
  astrology: true,
  traveler: true,
};
