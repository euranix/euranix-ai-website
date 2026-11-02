# Routes, SEO and preserved content

Baseline evidence is retained in [baseline-routes.json](../design-review/baseline-routes.json). Candidate details are in [routes.json](routes.json); nginx/browser assertions are in [release-checks.json](release-checks.json).

## Complete page inventory

| Path | Before | Candidate HTTP | Canonical / indexing | Desktop / mobile |
| --- | --- | --- | --- | --- |
| / | Preserved URL | 200 | https://euranix.ai/ · index, in sitemap | [Desktop](screenshots/home-desktop.png) / [Mobile](screenshots/home-mobile.png) |
| /contact | New useful page | 200 | https://euranix.ai/contact · index, in sitemap | [Desktop](screenshots/contact-desktop.png) / [Mobile](screenshots/contact-mobile.png) |
| /technology-review | New useful page | 200 | https://euranix.ai/technology-review · index, in sitemap | [Desktop](screenshots/technology-review-desktop.png) / [Mobile](screenshots/technology-review-mobile.png) |

No existing public page was moved or removed. No individual service-detail route existed in the baseline; the seven new .com detail paths extend /services. The AI homepage retains #usecases, #howitworks, #features, #outcomes and #pricing; #privacy and #demo support the current journeys. Query-based enquiry links remain usable and map to canonical Hub intent/service values.

## SEO before / after

| Area | Baseline | Candidate |
| --- | --- | --- |
| Identity | No canonical in recorded baseline; shared metadata did not establish per-page identity. | Explicit https://euranix.ai canonical on each of three pages. |
| Initial HTML | SPA root depended on JavaScript for substantive content. | React renderToString at build time emits each route, then React hydrates the same app. No framework migration. |
| Social | Incomplete/shared metadata. | Per-page OG/Twitter title, description and URL, plus a real 1200×630 brand sharing image. |
| Missing pages | Baseline /missing-review-check returned HTTP 200. | Genuine 404 document and HTTP 404, noindex and no homepage canonical, including missing assets. |
| Sitemap / robots | No complete site-specific generated inventory. | Generated from the same route metadata; 3 indexed URLs; production robots permits crawling. |
| Staging | Isolated earlier /design-review preview. | Separate loopback review server with header + HTML noindex and disallow robots; production output stays indexable. |
| Links/content | Original routes and assets. | Crawlable anchors, complete initial page content, preserved legal substance, favicon and verification assets. |

## Redirect / removal map

| Request | Handling |
| --- | --- |
| /index.html and /index | 308 to /, query preserved |
| /contact/ and other trailing-slash paths | 301 to extensionless path without trailing slash, query preserved |
| /contact.html and generated page .html aliases | 308 to extensionless path, query preserved |
| Unknown route or asset | 404; never redirected to homepage |
| /design-review/* | Retired local-only preview routes; 404. Never a deployed public URL, no SEO redirect needed |
| /404.html and /404 | Internal error document; direct access returns 404 |
| Existing edge HTTPS / apex-www rules | Not changed. Verify actual proxy behaviour after approval; nginx only owns path handling |

The old raw sitemap files were replaced by generated build outputs at the same /sitemap.xml and /robots.txt URLs. Historical screenshot/documentation paths remain repository artifacts, not site routes.

## Commercial and contact record

All seven service verticals are available. The source strategy is background; the latest user brief and clarifications take precedence. Prices not approved remain “Request pricing”. The one-hour review is free for a limited period with future standard fee US$199; no end date, countdown, payment or confirmed appointment is implied.

The original AI homepage advertised Starter $199/month and Business $499/month, with Enterprise custom pricing. Its dollar sign did not establish an approved currency. Those prices and package limits are retained in baseline-routes.json and the original design-review record for business review. The candidate explicitly replaces the unapproved public amounts with “Request pricing”. Unsupported old guarantees such as a 50-minute setup, unlimited capacity and SLA-backed 24/7 support are not carried forward as approved commitments. Capability categories remain, with data/access/deployment/support scope to agree. The stale corporate AI “Coming soon” label is corrected to available.

Confirmed email: contact@euranix.com. Existing product demo mail links remain. No business WhatsApp number or external booking URL was found in either baseline; none was invented. Optional WhatsApp in the form asks for the visitor’s own number. The corporate address is retained from the original contact page. Existing client portal, cloud portal and AI platform URLs are retained; availability probes are separately recorded.

[Preservation evidence](preservation.json) verifies original public images, favicons, verification assets, legal source files and the corporate chat component against the production baseline. PNG favicon is 64×64; touch icon is 180×180; ICO frames are square 16/32/48/64; original corrected SVG viewBox remains square. No replacement favicon was necessary.

## Remaining SEO release checks

Review the actual deployed domain, edge HTTPS/apex-www rules, crawler responses and social image fetches after an approved deployment. Confirm Search Console and analytics ownership/configuration with the owner; neither account was accessible in this task. Local raw/rendered and nginx checks do not prove live indexing, search ranking, analytics ingestion or link unfurling on external services. Keep these checks in the release checklist.
