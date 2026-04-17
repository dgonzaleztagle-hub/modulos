import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const port = Number(process.env.MODULOS_VIEWER_PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".ts": "text/plain; charset=utf-8",
};

const server = http.createServer((request, response) => {
  const url = request.url === "/" ? "/viewer/index.html" : request.url || "/";
  const target = safeResolve(url);

  if (!target) {
    response.writeHead(400);
    response.end("Invalid path");
    return;
  }

  fs.readFile(target, (error, file) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(target)] || "application/octet-stream",
    });
    response.end(file);
  });
});

server.listen(port, () => {
  console.log(`MODULOS Explorer disponible en http://localhost:${port}`);
});

function safeResolve(urlPath) {
  const pathname = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(path.join(root, pathname));

  if (!normalized.startsWith(root)) {
    return null;
  }

  return normalized;
}
