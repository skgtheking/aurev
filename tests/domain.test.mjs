import { test } from "node:test";
import assert from "node:assert/strict";
import {
  adult,
  age,
  parseDate,
  eligible,
  overlap,
  reciprocal,
  validatePerson,
  validateTrip,
  zodiac,
} from "../src/utils/domain.ts";
import { demoUser, profiles } from "../src/data/profiles.ts";
import { initialState } from "../src/store/initial.ts";
import { decode, encode } from "../src/services/persistence.ts";
import { blockPerson, reaction } from "../src/services/actions.ts";
const now = new Date("2026-11-11T12:00:00Z");
test("18th birthday boundary and impossible dates", () => {
  assert.equal(adult("2008-11-11", now), true);
  assert.equal(adult("2008-11-12", now), false);
  assert.equal(adult("2028-01-01", now), false);
  assert.equal(parseDate("2001-02-29"), null);
  assert.ok(parseDate("2000-02-29"));
  assert.equal(age("bad", now), -1);
});
test("30 fictional profiles are adult, unique and valid", () => {
  assert.equal(profiles.length, 30);
  assert.equal(new Set(profiles.map((p) => p.id)).size, 30);
  for (const p of profiles) {
    assert.ok(adult(p.dob, now));
    assert.equal(validatePerson(p), "");
  }
});
test("preferences are reciprocal and all filters apply", () => {
  const p = profiles[0],
    u = { ...demoUser, seeking: ["Woman"] },
    f = initialState().filters;
  assert.ok(reciprocal(u, p));
  assert.ok(eligible(p, u, f, []));
  assert.equal(eligible(p, u, f, [p.id]), false);
  assert.equal(eligible(p, u, { ...f, city: "Delhi" }, []), false);
  assert.equal(eligible(p, u, { ...f, gender: "Man" }, []), false);
  assert.equal(eligible(p, u, { ...f, intention: "Exploring" }, []), false);
  assert.equal(eligible(p, u, { ...f, minAge: 90 }, []), false);
  assert.equal(reciprocal(u, { ...p, seeking: ["Man"] }), false);
});
test("trip validation and inclusive overlap require same city and both opt-ins", () => {
  const a = {
    id: "a",
    city: "Goa",
    start: "2027-01-10",
    end: "2027-01-15",
    optIn: true,
  };
  const b = {
    ...a,
    id: "b",
    city: " goa ",
    start: "2027-01-15",
    end: "2027-01-20",
  };
  assert.equal(validateTrip(a, "2027-01-01"), "");
  assert.ok(overlap(a, b));
  assert.equal(overlap(a, { ...b, start: "2027-01-16" }), false);
  assert.equal(overlap(a, { ...b, optIn: false }), false);
  assert.equal(overlap(a, { ...b, city: "Kochi" }), false);
  assert.ok(validateTrip({ ...a, end: "2027-01-09" }, "2027-01-01"));
  assert.ok(validateTrip({ ...a, start: "2027-02-30" }, "2027-01-01"));
  assert.ok(validateTrip(a, "2028-01-01"));
});
test("zodiac cusp boundaries", () => {
  assert.equal(zodiac("2000-03-20"), "Pisces");
  assert.equal(zodiac("2000-03-21"), "Aries");
  assert.equal(zodiac("2000-12-22"), "Capricorn");
  assert.equal(zodiac("2000-01-19"), "Capricorn");
  assert.equal(zodiac("2000-01-20"), "Aquarius");
  assert.equal(zodiac("bad"), "Unknown");
});
test("incomplete profile cannot finish onboarding", () => {
  assert.equal(validatePerson(demoUser), "");
  assert.ok(validatePerson({ ...demoUser, seeking: [] }));
  assert.ok(validatePerson({ ...demoUser, dob: "2018-01-01" }));
  assert.ok(validatePerson({ ...demoUser, bio: "hi" }));
  assert.ok(validatePerson({ ...demoUser, photos: [] }));
});
test("like is idempotent and mutual match creates a single conversation", () => {
  const a = reaction(initialState(), "p1", true);
  const b = reaction(a, "p1", true);
  assert.deepEqual(b.likes, ["p1"]);
  assert.ok(b.matches.includes("p1"));
  assert.equal(b.chats.filter((c) => c.personId === "p1").length, 1);
  assert.ok(reaction(b, "p3", false).passes.includes("p3"));
});
test("ten free likes per local day reset at midnight and Privé stays unlimited", async () => {
  const { dailyLikeCount, canLike } = await import("../src/services/actions.ts");
  const day1 = new Date("2026-11-11T12:00:00");
  const day2 = new Date("2026-11-12T12:00:00");
  let state = initialState();
  for (let i = 0; i < 10; i++) state = reaction(state, `person-${i}`, true, day1);
  assert.equal(dailyLikeCount(state, day1), 10);
  assert.equal(canLike(state, "another", day1), false);
  assert.equal(reaction(state, "another", true, day1), state);
  assert.equal(dailyLikeCount(state, day2), 0);
  const tomorrow = reaction(state, "another", true, day2);
  assert.equal(dailyLikeCount(tomorrow, day2), 1);
  assert.equal(tomorrow.likes.length, 11);
  assert.ok(reaction({ ...state, prive: true }, "another", true, day1).likes.includes("another"));
  const blocked = blockPerson(initialState(), "p1");
  assert.equal(reaction(blocked, "p1", true), blocked);
});
test("block removes match and history and stores local report", () => {
  const a = blockPerson(initialState(), "p5", "Harassment");
  assert.ok(a.blocked.includes("p5"));
  assert.equal(a.matches.includes("p5"), false);
  assert.equal(
    a.chats.some((c) => c.personId === "p5"),
    false,
  );
  assert.equal(a.reports[0].reason, "Harassment");
});
test("versioned persistence round-trips all changes", () => {
  const a = {
    ...reaction(initialState(), "p1", true),
    user: demoUser,
    prive: true,
    trips: [
      {
        id: "t",
        city: "Goa",
        start: "2027-01-01",
        end: "2027-01-04",
        optIn: true,
      },
    ],
  };
  assert.deepEqual(decode(encode(a), initialState()), a);
});
test("corrupt storage and unsupported versions recover safely", () => {
  const fallback = initialState();
  for (const raw of [
    null,
    "bad",
    "{}",
    JSON.stringify({ version: 2, state: fallback }),
    JSON.stringify({ version: 1, state: { ...fallback, chats: [{}] } }),
    JSON.stringify({ version: 1, state: { ...fallback, likes: [4] } }),
  ])
    assert.deepEqual(decode(raw, fallback), fallback);
});

test("queued persistence saves in order, survives failure, and hydrates latest state", async () => {
  const { createPersistor } = await import("../src/services/persistence.ts");
  let raw = null;
  const order = [];
  let fail = true;
  const save = createPersistor({
    setItem: async (_key, value) => {
      if (fail) {
        fail = false;
        throw Error("disk unavailable");
      }
      await new Promise((r) => setTimeout(r, 2));
      raw = value;
      order.push(JSON.parse(value).state.likes.length);
    },
  });
  const base = initialState();
  await assert.rejects(save(base));
  const a = { ...base, likes: ["p1"] },
    b = { ...base, likes: ["p1", "p2"] };
  await Promise.all([save(a), save(b)]);
  assert.deepEqual(order, [1, 2]);
  assert.deepEqual(decode(raw, base), b);
});

test("legacy intentions and daily likes migrate while preserving demo state", () => {
  const old = { ...initialState(), dailyLikes: undefined, user: {
    ...demoUser,
    intention: "Long-term",
    intentions: undefined,
  }, filters: { ...initialState().filters, intention: "Exploring" } };
  const migrated = decode(encode(old), initialState());
  assert.deepEqual(migrated.user.intentions, ["Long-term relationship"]);
  assert.equal(migrated.filters.intention, "Still figuring it out");
  assert.deepEqual(migrated.dailyLikes, { date: "", ids: [] });
});
test("multiple connection intentions work with discovery filtering", () => {
  const person = { ...profiles[0], intentions: ["Casual dating", "Platonic connections"] };
  const filters = { ...initialState().filters, intention: "Platonic connections" };
  assert.equal(eligible(person, demoUser, filters, []), true);
  assert.equal(eligible(person, demoUser, { ...filters, intention: "Open to marriage" }, []), false);
});
