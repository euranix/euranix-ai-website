// Local-only review server. Production Dockerfiles and nginx remain unchanged.
import http from "node:http";
import { gzipSync } from "node:zlib";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const ai = fs.existsSync(path.join(root, "App.tsx"));
const port = Number(process.env.PORT || (ai ? 4274 : 4273));
const reviewRoutes = [
  "/design-review",
  "/design-review/",
  "/design-review/enquiry",
  ...(!ai ? ["/design-review/custom-software"] : []),
];
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/vnd.microsoft.icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
http
  .createServer((req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    let url;
    try {
      url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }
    if (url === "/robots.txt") {
      res.setHeader("Content-Type", "text/plain");
      res.end("User-agent: *\nDisallow: /\n");
      return;
    }
    const review =
      url.startsWith("/design-review") || url.startsWith("/review-assets/");
    const dir = path.join(root, review ? "dist-review" : "dist");
    let file = path.resolve(dir, "." + url);
    if (file !== dir && !file.startsWith(dir + path.sep)) {
      res.writeHead(400);
      res.end("Bad path");
      return;
    }
    if (reviewRoutes.includes(url))
      file = path.join(root, "dist-review/design-review/index.html");
    else if (url.startsWith("/design-review")) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(
        '<html lang="en"><meta name="robots" content="noindex"><title>Page not found</title><h1>Page not found</h1><a href="/design-review/">Return to design review</a></html>',
      );
      return;
    } else if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      if (path.extname(url)) {
        res.writeHead(404);
        res.end("Asset not found");
        return;
      }
      file = path.join(root, "dist/index.html"); // Preserve existing SPA fallback for existing routes.
    }
    if (!fs.existsSync(file)) {
      res.writeHead(503);
      res.end("Build production and design-review assets first.");
      return;
    }
    let body = fs.readFileSync(file);
    if (reviewRoutes.includes(url)) {
      const page = url.endsWith("/enquiry")
        ? "Enquiry"
        : url.endsWith("/custom-software")
          ? "Custom Software Engineering"
          : ai
            ? "Managed AI"
            : "Technology and Operations";
      body = Buffer.from(
        body
          .toString()
          .replace(
            /<title>.*?<\/title>/,
            "<title>" +
              page +
              " design review | Euranix" +
              (ai ? " AI" : "") +
              "</title>",
          ),
      );
    }
    res.setHeader(
      "Content-Type",
      mime[path.extname(file)] || "application/octet-stream",
    );
    if (body.length > 1024 && /\bgzip\b/.test(req.headers['accept-encoding'] || '') && ['.html','.js','.css','.svg','.txt','.xml'].includes(path.extname(file))) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      body = gzipSync(body);
    }
    res.end(body);
  })
  .listen(port, "127.0.0.1", () =>
    console.log(
      "Local design review: http://127.0.0.1:" + port + "/design-review/",
    ),
  );
