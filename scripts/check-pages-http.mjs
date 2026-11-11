import assert from "node:assert/strict";
import { once } from "node:events";
import { readdir, readFile, stat } from "node:fs/promises";
import { createPreviewServer } from "./preview.mjs";

const server = createPreviewServer();
server.listen(0, "127.0.0.1");
await once(server, "listening");
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  const redirect = await fetch(origin + "/", { redirect: "manual" });
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get("location"), "/aurev/");
  const html = await readFile("dist/index.html", "utf8");
  const home = await fetch(origin + "/aurev/");
  assert.equal(home.status, 200);
  assert.equal(await home.text(), html);
  for (const route of [
    "/aurev/person/p1?from=share",
    "/aurev/chat/p5",
    "/aurev/trip",
    "/aurev/onboarding",
  ]) {
    const r = await fetch(origin + route, { redirect: "manual" });
    assert.equal(r.status, 404);
    assert.equal(await r.text(), html);
    assert.equal(r.headers.get("location"), null);
  }
  const files = await readdir("dist", { recursive: true });
  let count = 0;
  for (const file of files) {
    const info = await stat("dist/" + file);
    if (!info.isFile()) continue;
    const r = await fetch(origin + "/aurev/" + encodeURI(file));
    assert.equal(r.status, 200, file);
    assert.equal((await r.arrayBuffer()).byteLength, info.size, file);
    if (file.endsWith(".ttf"))
      assert.equal(r.headers.get("content-type"), "font/ttf");
    if (file.endsWith(".js"))
      assert.match(r.headers.get("content-type"), /^text\/javascript/);
    count++;
  }
  for (const path of [
    "/assets/missing.png",
    "/aurev/assets/missing.png",
    "/portfolio",
  ])
    assert.equal((await fetch(origin + path)).status, 404, path);
  console.log(
    `Pages HTTP smoke checks passed: /aurev/, ${count} files, project redirects, nested route 404 shells, JS/font MIME types and outside-project isolation.`,
  );
} finally {
  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
}
