const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const DISPLAY_HOST = HOST === "0.0.0.0" ? "127.0.0.1" : HOST;
const CAN_FALLBACK_PORT = !process.env.PORT;
const ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://${DISPLAY_HOST}:${PORT}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  return path.join(ROOT, safePath);
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end("Method Not Allowed");
      return;
    }

    const filePath = resolveRequestPath(req.url);

    if (!filePath.startsWith(ROOT) || path.basename(filePath).startsWith(".")) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(error.code === "ENOENT" ? 404 : 500);
        res.end(error.code === "ENOENT" ? "Not Found" : "Server Error");
        return;
      }

      const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-cache"
      });

      if (req.method === "HEAD") {
        res.end();
        return;
      }

      res.end(data);
    });
  });
}

function listen(port, attemptsRemaining = 10) {
  const server = createServer();

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && CAN_FALLBACK_PORT && attemptsRemaining > 0) {
      listen(port + 1, attemptsRemaining - 1);
      return;
    }

    throw error;
  });

  server.listen(port, HOST, () => {
    console.log(`Load Boosters landing page running at http://${DISPLAY_HOST}:${port}`);
  });
}

listen(PORT);
