import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

/** Mount exactly like a project Pages site, including its real 404 status. */
export function createPreviewServer({
  directory = "dist",
  base = "/aurev",
} = {}) {
  const root = resolve(directory);
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (pathname === "/" || pathname === base) {
        res.writeHead(302, { Location: base + "/" + url.search });
        res.end();
        return;
      }
      if (!pathname.startsWith(base + "/")) {
        res.writeHead(404);
        res.end("Outside Aurev project path");
        return;
      }
      let file = resolve(root, "." + pathname.slice(base.length));
      if (file !== root && !file.startsWith(root + sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      let status = 200;
      try {
        if ((await stat(file)).isDirectory())
          file = resolve(file, "index.html");
        await stat(file);
      } catch {
        if (extname(file)) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        file = resolve(root, "404.html");
        status = 404;
      }
      const data = await readFile(file);
      res.writeHead(status, {
        "Content-Type": mime[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    } catch {
      res.writeHead(500);
      res.end("Run npm run export:web before starting the preview.");
    }
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const port = Number(process.env.PORT || 4173);
  createPreviewServer().listen(port, "127.0.0.1", () =>
    console.log(`Aurev Pages preview: http://localhost:${port}/aurev/`),
  );
}
