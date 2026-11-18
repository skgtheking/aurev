import { test } from "node:test";
import assert from "node:assert/strict";
import { interests, interestGroups } from "../src/data/profiles.ts";
import { normalizeTypeChoices, publicTypePreferences } from "../src/utils/typePreferences.ts";
import { initialState } from "../src/store/initial.ts";
import { demoUser } from "../src/data/profiles.ts";
import { encode, decode } from "../src/services/persistence.ts";

test("featured interests are unique, grouped and contain co-founder suggestions", () => {
  assert.equal(interests.length, new Set(interests).size);
  for (const x of ["Café hopping", "Pilates", "Matcha", "Art & galleries", "Venting"]) assert.ok(interests.includes(x));
  assert.ok(!interests.includes("Nightlife"));
  assert.ok(Object.keys(interestGroups).length >= 3);
});
test("My Type removes duplicates and dealbreakers not selected", () => {
  assert.deepEqual(normalizeTypeChoices(["Loyal", "Loyal", "Kinky"], ["Loyal", "Funny"]), {
    selected: ["Loyal", "Kinky"], required: ["Loyal"]
  });
});
test("sensitive My Type choices remain hidden from public summary", () => {
  assert.deepEqual(publicTypePreferences(["Kinky", "Safe space"]), ["Safe space"]);
});
test("saved My Type and sound preference survive v1 persistence", () => {
  const initial = initialState();
  const state = { ...initial, soundEnabled: true, user: {
    ...demoUser, typePreferences: ["Loyal", "Kinky"], typeDealbreakers: ["Loyal"], showMyType: true,
  }};
  assert.deepEqual(decode(encode(state), initial), state);
});
