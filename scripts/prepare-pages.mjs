import { copyFile, writeFile } from "node:fs/promises";

// Pages serves this app shell for unmatched client routes while keeping the URL.
// Assets are absolute under /aurev/, so they also resolve on nested route reloads.
await copyFile("dist/index.html", "dist/404.html");
await writeFile("dist/.nojekyll", "");
console.log("Prepared GitHub Pages: 404.html app shell and .nojekyll.");
