import assert from "node:assert/strict";
import { readFile, readdir, lstat, access } from "node:fs/promises";
import { resolve, relative } from "node:path";

const root = resolve("dist");
const base = "/aurev";
const config = JSON.parse(await readFile("app.json", "utf8")).expo;
assert.equal(config.web.output, "single");
assert.equal(config.experiments.baseUrl, base);
const html = await readFile(resolve(root, "index.html"), "utf8");
assert.equal(
  await readFile(resolve(root, "404.html"), "utf8"),
  html,
  "404 must serve the identical SPA shell",
);
await access(resolve(root, ".nojekyll"));
const references = new Set();
for (const [, url] of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
  if (/^(?:https?:|data:|#)/.test(url)) continue;
  assert.ok(url.startsWith(base + "/"), `Unprefixed HTML asset: ${url}`);
  references.add(url);
}
async function walk(directory) {
  const results = [];
  for (const name of await readdir(directory)) {
    const path = resolve(directory, name),
      info = await lstat(path);
    assert.ok(!info.isSymbolicLink(), `Symlink in output: ${path}`);
    assert.ok(
      !/^\.env(?:\.|$)/.test(name),
      `Environment file in output: ${path}`,
    );
    if (info.isDirectory()) results.push(...(await walk(path)));
    else results.push(path);
  }
  return results;
}
const files = await walk(root);
const scripts = files.filter((file) => file.endsWith(".js"));
for (const script of scripts) {
  const source = await readFile(script, "utf8");
  for (const [, url] of source.matchAll(
    /["'](\/aurev\/(?:assets|_expo)\/[^"']+)["']/g,
  ))
    references.add(url);
  // Exported font/image references must not point at the domain root.
  assert.ok(
    !/["']\/(?:assets\/node_modules|_expo\/static\/js\/web)\//.test(source),
    `Unprefixed bundle asset in ${relative(root, script)}`,
  );
}
assert.ok(scripts.length > 0, "No JS bundles found");
assert.ok(
  files.filter((file) => file.endsWith(".ttf")).length >= 4,
  "Expected bundled local typography",
);
for (const url of references) {
  const pathname = new URL(url, "https://skgtheking.github.io").pathname;
  const path = resolve(
    root,
    "." + decodeURIComponent(pathname.slice(base.length)),
  );
  assert.ok(
    relative(root, path) && !relative(root, path).startsWith(".."),
    `Escaping asset path: ${url}`,
  );
  await access(path);
}
console.log(
  `Verified ${references.size} /aurev/ JS/font/icon/asset references, ${files.length} files, identical 404 fallback and .nojekyll.`,
);
