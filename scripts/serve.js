/**
 * serve.js — tiny zero-dependency static file server for local development.
 * ---------------------------------------------------------------------------
 * The game loads level data with fetch(), which browsers block over file://,
 * so run `npm start` and open the printed URL. No npm dependencies are added
 * (keeps package-lock.json untouched); this uses only Node's built-ins.
 *
 *   npm start            -> http://localhost:5500/src/game.html?level=tutorial
 *   PORT=8080 npm start  -> serve on a different port
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PORT = Number(process.env.PORT) || 5500;
const ENTRY = "/src/game.html?level=tutorial";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") {
    res.writeHead(302, { Location: ENTRY });
    res.end();
    return;
  }

  // Resolve within ROOT to prevent path traversal.
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found: " + urlPath);
      return;
    }
    const type =
      MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("The Bunny's Backlog dev server running:");
  console.log("http://localhost:" + PORT + ENTRY);
});
