import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const config = JSON.parse(readFileSync(new URL("../app.json", import.meta.url), "utf8")).expo;
const eas = JSON.parse(readFileSync(new URL("../eas.json", import.meta.url), "utf8"));
test("Android preview has a stable, valid application ID and increasing version code", () => {
  assert.match(config.android.package, /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/);
  assert.equal(config.android.package, "com.skgtheking.aurev");
  assert.ok(Number.isInteger(config.android.versionCode) && config.android.versionCode > 0);
  assert.equal(config.orientation, "portrait");
});
test("Preview creates installable standalone APK; store build is a separate AAB", () => {
  assert.equal(eas.build.preview.distribution, "internal");
  assert.equal(eas.build.preview.android.buildType, "apk");
  assert.equal(eas.build.preview.developmentClient ?? false, false);
  assert.equal(eas.build.production.android.buildType, "app-bundle");
  assert.equal(eas.build.production.distribution, "store");
});
