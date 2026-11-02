// Local review only. Production is served by nginx.conf.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
const root = path.resolve(process.env.SITE_DIST || "dist");
const port = Number(
  process.env.PORT || (fs.existsSync("public/brand-logo.png") ? 4374 : 4373),
);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
http
  .createServer((req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    let u;
    try {
      u = new URL(req.url, "http://localhost");
      u.pathname = decodeURIComponent(u.pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405).end();
      return;
    }
    if (u.pathname === "/robots.txt") {
      res.end("User-agent: *\nDisallow: /\n");
      return;
    }
    if (
      u.pathname === "/index.html" || u.pathname === "/index" ||
      (u.pathname !== "/" && u.pathname.endsWith("/"))
    ) {
      res
        .writeHead(308, {
          Location:
            (u.pathname === "/index.html" || u.pathname === "/index"
              ? "/"
              : u.pathname.replace(/\/+$/, "")) + u.search,
        })
        .end();
      return;
    }
    let file = path.resolve(root, "." + u.pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(400).end();
      return;
    }
    if (u.pathname === "/") file = path.join(root, "index.html");
    else if (!fs.existsSync(file) || !fs.statSync(file).isFile())
      file += ".html";
    let status = u.pathname === "/404" || u.pathname === "/404.html" ? 404 : 200;
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      file = path.join(root, "404.html");
      status = 404;
    }
    let body = fs.readFileSync(file);
    res.setHeader(
      "Content-Type",
      mime[path.extname(file)] || "application/octet-stream",
    );
    if (path.extname(file) === ".html")
      body = Buffer.from(
        body
          .toString()
          .replace(
            /<meta name="robots" content="[^"]*"\/>/,
            '<meta name="robots" content="noindex,nofollow,noarchive"/>',
          ),
      );
    if (req.headers["accept-encoding"]?.includes("gzip")) {
      body = gzipSync(body);
      res.setHeader("Content-Encoding", "gzip");
    }
    res.writeHead(status);
    res.end(req.method === "HEAD" ? undefined : body);
  })
  .listen(port, "127.0.0.1", () =>
    console.log("Local protected review: http://127.0.0.1:" + port),
  );
