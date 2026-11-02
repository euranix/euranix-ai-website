import fs from "node:fs";
import path from "node:path";
import { render, routes, ORIGIN, LOGO } from "../.build/server/entry-server.js";
const template = fs.readFileSync("dist/index.html", "utf8");
const escape = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
for (const page of [
  ...routes,
  {
    path: "/404",
    title: "Page not found | Euranix" + (ORIGIN.includes(".ai") ? " AI" : ""),
    description: "The requested page could not be found.",
    noindex: true,
  },
]) {
  const canonical = ORIGIN + (page.path === "/" ? "/" : page.path);
  const head = `<title>${escape(page.title)}</title>
<meta name="description" content="${escape(page.description)}"/>
<meta name="robots" content="${page.noindex ? "noindex,follow" : "index,follow"}"/>
${page.path === "/404" ? "" : `<link rel="canonical" href="${canonical}"/>`}
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="${ORIGIN.includes(".ai") ? "Euranix AI" : "Euranix"}"/>
<meta property="og:title" content="${escape(page.title)}"/>
<meta property="og:description" content="${escape(page.description)}"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:image" content="${ORIGIN}/social-share.png"/>
<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="Euranix — technology and operations"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escape(page.title)}"/>
<meta name="twitter:description" content="${escape(page.description)}"/>
<meta name="twitter:image" content="${ORIGIN}/social-share.png"/>`;
  const output = template
    .replace("<!--app-head--><title>Euranix</title>", head)
    .replace("<!--app-html-->", render(page.path));
  if (!output.includes('rel="canonical"') && page.path !== "/404")
    throw Error("Missing metadata: " + page.path);
  const file = path.join(
    "dist",
    page.path === "/" ? "index.html" : page.path.slice(1) + ".html",
  );
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, output);
}
fs.writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`,
);
fs.writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .filter((r) => !r.noindex)
    .map((r) => "<url><loc>" + ORIGIN + r.path + "</loc></url>")
    .join("\n")}\n</urlset>\n`,
);
fs.mkdirSync(".build", { recursive: true });
fs.writeFileSync(".build/routes.json", JSON.stringify(routes, null, 2));
console.log(
  "Rendered " + routes.length + " routes plus a real missing-page document.",
);
