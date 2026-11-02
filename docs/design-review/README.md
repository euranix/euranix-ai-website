# Euranix flagship design review
Reviewed 2 November 2026. This is a local design-review milestone, not a production release.

## Scope and preservation
Both repositories remain independent React 18 / TypeScript / Vite projects. Both started clean on main; no unrelated working changes were present. No repository AGENTS.md was found; the supplied CodeGraph instructions were followed and neither repository has a .codegraph directory.

| Site | Repository | Baseline commit | Feature branch |
| --- | --- | --- | --- |
| Portfolio | C:\Users\phoen\OneDrive\Documents\ChatGPT\Euranix Websites\euranix-website | c4cd685e9026ef825b1bb10a5dfd50fdbfb0eb8d | codex/flagship-design-review |
| AI | C:\Users\phoen\OneDrive\Documents\ChatGPT\Euranix Websites\euranix-ai-website | 75802365f8811093c9043632c860aa5838e5465f | codex/flagship-design-review |

The original routes, content, contact links, product assets, favicons, legal pages, verification file, robots and sitemaps are unchanged. Final standard builds match the baseline byte for byte (21 files for the portfolio, 8 for AI). See production-build-baseline.json and production-preservation.txt.

Production Dockerfiles, nginx files, docker-compose and hosting/DNS settings were not changed. The portfolio uses Node 20 Alpine → nginx 1.27 Alpine; AI uses Node 18 → nginx stable Alpine, with a Docker Compose service. Both document Coolify deployment. The repositories contain no GitHub Actions workflows. Actual Coolify resources and branch triggers were not accessible; no deployment actions were performed. Only feature branches are pushed.

## What to review
| Area | Local URL |
| --- | --- |
| Portfolio homepage | http://127.0.0.1:4273/design-review/ |
| AI homepage | http://127.0.0.1:4274/design-review/ |
| Custom Software Engineering | http://127.0.0.1:4273/design-review/custom-software |
| Portfolio enquiry | http://127.0.0.1:4273/design-review/enquiry |
| AI enquiry | http://127.0.0.1:4274/design-review/enquiry |

The original site remains available at each server's root. Preview links to existing product, about and legal pages use those unchanged routes. Cross-domain links retain the public Euranix domains; they intentionally do not claim that the other preview is live. Local URLs work on the development computer while the servers are running. No hosted preview was deployed.

The light portfolio and dark AI presentation share the approved logo, local system typography, serif emphasis, spacing, red/orange action colours, focus styles, form structure and reduced-motion conventions. They have separate page narratives: the portfolio connects seven service verticals to business needs; AI explains three practical use cases, information boundaries and ongoing management. No stock imagery, generated brand assets, invented proof, external fonts or new runtime dependencies were introduced. The interactive business-priority map and synthetic AI sample provide useful exploration. Motion is limited to short button feedback and normal anchor scrolling, both removed for reduced motion.

The software page includes suitability, scope, six delivery stages, security, AI assistance with human responsibility, test evidence, release/rollback, vulnerability management, operating boundaries, pricing basis and FAQs. The illustrative acceptance checklist is labelled as a process example, not customer evidence.

## Baseline evidence and SEO findings
baseline-routes.json records rendered titles, descriptions, canonicals, indexability, headings, complete visible page text, links, scripts, response status and overflow. It preserves the original content and commercial claims for comparison. Screenshots of the original homepages at desktop and mobile widths are in screenshots/baseline-*.png.

Portfolio routes: /, /about, /services, /contact, /products, /studio, /privacy, /terms, /data-deletion, /euranix-hub/privacy, /euranix-hub/terms and /euranix-hub/data-deletion. The public sitemap lists all except /studio, with www.euranix.com URLs. A second sitemap.xml exists at repository root; both files are preserved. robots.txt allows crawling and points to the www host. googled9388c47d5011fc7.html is preserved.

All portfolio routes currently inherit the same title, description and https://www.euranix.com/ canonical from index.html. This incorrectly canonicalises detail pages to the homepage. The original HTML contains an empty React root; meaningful content appears after JavaScript rendering. No pre-render or server rendering exists. The future rollout should implement route-specific metadata and evaluate prerendering based on actual crawler evidence, without assuming a framework migration is necessary.

AI is a single-page site with hash sections including outcomes, howitworks, usecases, features and pricing. Its source title is “Euranix AI — Your Business, Remembered”; description is “Euranix AI — Turn your business knowledge into AI that works for you. Secure, private, powerful.” There is no canonical, robots.txt or sitemap in this repository. Its original HTML also depends on JavaScript for visible content. The intended AI identity is euranix.ai; it must not canonicalise to euranix.com.

Both nginx configurations fall back to index.html for unknown paths. The portfolio renders the header/footer with no missing-page content; AI renders the homepage at unknown paths. Both are existing soft-404 problems. Existing redirects are not defined in the repository nginx files; any domain/HTTPS redirects belong to hosting. Direct HTTP baseline requests to apex/www hosts and robots/sitemaps returned 403 in this environment (live-http-baseline.json), so live redirect chains, live source parity and external endpoint availability remain unverified. Public web retrieval returned the expected site titles but no readable page body. The screenshots and measurements in this review are of the checked-out production builds, not a certified snapshot of the remote deployment.

No connected Search Console or analytics data was available. Traffic importance for every page is UNKNOWN. No GA/GTM identifiers or consent interface were found in the checked-in frontends. This does not rule out edge-injected analytics or cookies inside third-party integrations. No analytics identifier or verification file was removed.

## Functionality and contact preservation
The portfolio header links to Products, Capabilities, Our approach, Euranix AI and Cloud Portal; the footer adds the client portal, contact email and legal links. The product library contains Euranix Hub, CollectPro, EuraFinX, Euranix Storage, EuraSplit and Euranix AI, with existing product screenshots and email demo actions. The existing “Coming soon” AI product label conflicts with the user's current availability clarification; it is recorded for later correction rather than silently editing the original product page during this preview.

The portfolio loads Odoo live chat from https://portal.euranix.com/im_livechat/loader/1 and https://portal.euranix.com/im_livechat/assets_embed.js. Its apparent purpose is visitor conversation/support through the existing portal. It remains on the original routes. The isolated preview intentionally does not load that live conversation widget during fixture review; no replacement has been approved, and Hub enquiry integration does not imply chat replacement.

Confirmed/reused destinations:
- contact@euranix.com, including the original demo and deletion subject links.
- https://portal.euranix.com (client portal / Odoo chat host).
- https://www.euranixcloud.com (Cloud Portal).
- https://platform.euranix.ai (AI platform).
- https://euranix.ai and https://www.euranix.com (cross-domain navigation).

No WhatsApp number, telephone CTA or external appointment-booking URL was found. AI “Book a Demo” is an email action, not an appointment integration. No missing contact value was invented. The AI original footer's privacy/terms links are email-only. The preview links to the existing corporate policy pages, explicitly identified as Euranix policies; AI-specific processing terms still require review before rollout.

## Commercial and capability review
The user's latest brief and clarifications take precedence over Euranix_Service_Portfolio_and_Marketing_Strategy.docx. The strategy supplied background for service scope, application examples and lifecycle details; its launch restrictions, campaign instructions and earlier undecided review pricing did not authorise publishing, spend or restrict the seven available verticals.

Existing AI prices are retained in the original site and baseline text for review:
- Starter: $199 per month, flat rate; up to 10 people, one agent, 10 GB, documents/URLs, chat/notes, managed setup and email support.
- Business: $499 per month, flat rate; up to 50 people, five agents, 50 GB, databases, voice, website widget, synchronisation, usage analytics and priority support.
- Enterprise: custom price; existing copy claims unlimited people/agents, private/on-premise models, integrations, white-label, dedicated manager and SLA-backed 24/7 support.

The source uses a dollar sign without establishing a currency code. These are existing claims, not newly approved amounts or scope. Preview service prices say “Request pricing.” The confirmed review is a one-hour meeting, free for a limited period, with a future standard fee of US$199. There is no expiry, countdown, automatic billing or appointment confirmation.

Claims requiring substantiation include 50-minute activation, zero wait time, instant/precise answers, no reformatting, support for any data source, no migration needed, universal privacy/on-premise statements, blanket statements about public AI training, compliance readiness, unlimited capacity and round-the-clock human support. The preview uses scoped wording, evaluation steps and agreed human hours. Automated monitoring is distinguished from human availability; no universal 24-hour permanent zero-day fix is promised.

The AI demonstration is a synthetic interactive fixture, not a verified product integration. It demonstrates referenced information, missing information and human escalation as desired experiences. Product-level permission enforcement, source retrieval, deployment modes, integrations, voice and escalation require demonstration against the actual product before those claims can be certified. All seven service verticals are presented as available, per the user; this is distinct from verifying every implementation option.

## Hub integration boundary
Hub is the future system of record for enquiries and sales. No final deployed API contract was supplied; the referenced investigation is only a proposal. Future Euranix CX integration is excluded.

design-review/adapter.ts defines a local domain model and an isolated HubTransport interface, not a wire contract or invented endpoint. Its production transport fails closed. The fixture function accepts only a test scenario and AbortSignal; no name, email, company or message is passed to it. The fixture requires the design-review build mode AND a loopback hostname. The form defaults to “Hub unavailable.” Simulated success explicitly says that nothing was sent and no enquiry or appointment was created.

The form demonstrates loading, field validation, an error summary with focus, unavailable and recoverable failure states, retained inputs on retry, prevention of concurrent submissions, an optional unchecked marketing preference, and a labelled test success. Form state exists only in memory. No analytics, storage or network submission receives the contents. Browser checks assert no POST request during all outcomes. Existing email remains the real enquiry path.

Before production integration, obtain the final method/URL, authentication and CORS rules, allowed public configuration, bot-verification mechanism, field/schema limits and errors, attribution allowlist, idempotency scope/expiry, duplicate/timeout semantics, retry/rate-limit contract, and a receipt that confirms durable Hub acceptance. Treat network ambiguity as unconfirmed until reconciled. Agree data retention, privacy notices and marketing consent handling. Server secrets must not enter public VITE variables. Then add contract-backed integration tests; never promote the fixture success into production.

## Isolation and preview indexing
npm run build still produces the original dist. Only npm run build:review selects design-review/index.html and writes dist-review with review-assets. The production Dockerfiles still build and copy dist only. Production output hashes prove the new fixture code and preview restrictions do not enter that output.

The local server binds only 127.0.0.1, serves built assets (not the Vite development server), returns X-Robots-Tag: noindex, nofollow, noarchive, and overrides robots.txt with Disallow: /. Preview HTML also has noindex. There are no preview canonicals or sitemap entries. Known preview deep links return 200; unknown preview routes and missing assets return 404. The generic preview description identifies a design review and is not proposed production SEO copy. Route-specific titles are supplied by the review server and client.

## Verification and reproducibility
Baseline: both production builds and TypeScript checks passed. Main-site lint passed with one existing react-refresh warning in ThemeContext.tsx. AI has no repository lint command/config. Existing main-site build warnings concern its large Three.js chunk and stale Browserslist data; AI's Vite CJS API warning is pre-existing.

Final: both production and preview builds, full TypeScript and preview TypeScript passed. Main lint has only the same pre-existing warning. AI preview files were linted using the main repository's existing ESLint tool/config without adding runtime or shared build infrastructure. All browser checks passed, with zero axe WCAG A/AA violations detected across the five pages at both widths. Automated accessibility checks are not a complete accessibility certification.

Checks cover direct URL loading, links/assets, navigation, service discovery, AI interactions, keyboard skip/focus, menu/Escape, validation, busy/disabled states, all fixture outcomes, no network submission, consent default, retry preservation, reduced motion, console errors, overflow and preview 404/indexing behaviour. Full desktop/mobile screenshots were visually inspected. Desktop is 1440×1000; mobile is 390×844. Additional final checks at widths 320, 768 and 1024 found no overflow; raw and rendered page titles match, gzip compression is confirmed, and the existing site root still returns 200 (final-metadata.json). Existing functionality preservation is additionally demonstrated by identical standard build files.

To run, in each repository:
1. npm ci
2. npm run build
3. npm run build:review
4. npm run preview:review

The server prints its local URL. For browser evidence, install playwright and @axe-core/playwright in a separate tool directory, set REVIEW_TOOL_ROOT to that directory, and use installed Microsoft Edge. No test tooling is shipped in the website:
- node scripts/review-check.cjs
- node scripts/review-baseline.cjs (captures the current standard build; preserve committed baseline evidence before refreshing)
- node scripts/review-performance.cjs (fresh sequential comparison)

Performance requires an additional standard preview server: npm run preview -- --host 127.0.0.1 --port 4173 --strictPort for the portfolio, or port 4174 for AI. Run performance scripts sequentially after builds/tests finish. Full methodology and individual measurements are in baseline-performance.json and preview-performance.json. These are repeatable local lab observations, not production Core Web Vitals or promises of customer performance.

## Remaining work after design approval
Extend the accepted visual system to the remaining existing pages without removing useful content or changing URLs casually. Complete service detail pages and the fuller application catalogue with edition/licence/support scope. Resolve the existing AI product status, price and claim discrepancies with the business owner. Confirm supported hours/capacity, service owners and proof assets. Validate actual AI use cases and AI-specific legal terms. Connect the final Hub contract and verify durable acceptance, attribution, anti-bot handling and retry safety. Review Odoo chat continuity separately.

Plan route-specific metadata, canonical hosts, true missing-page behaviour and crawler-visible HTML using real search evidence. Confirm live redirects, analytics/consent and deployment details with access to the hosting and measurement systems. Expand browser/device and assistive-technology checks before a later production release. This milestone stops at design review; no merger, production deployment or wider page redesign is included.


## Performance comparison

Median of three fresh, sequential runs per device, with gzip enabled on both servers. Values show baseline → preview; lower is generally better. Cross-origin resources without timing permission are not fully represented in transfer bytes. See JSON methodology. These observations do not predict production latency.

| Site / viewport | LCP ms | CLS | DOM content loaded ms | Reported resource transfer kB |
| --- | --- | --- | --- | --- |
| euranix.com / desktop | 668 → 576 | 0.184 → 0 | 289 → 76 | 324.2 → 133.6 |
| euranix.com / mobile | 600 → 568 | 0.0048 → 0 | 272 → 77 | 165.5 → 133.6 |
| euranix.ai / desktop | 1308 → 520 | 0.0141 → 0 | 343 → 71 | 143.8 → 133.7 |
| euranix.ai / mobile | 1120 → 536 | 0.0717 → 0 | 326 → 78 | 143.8 → 133.7 |

The preview removes the homepage WebGL/particle work and external font loading. The portfolio mobile baseline avoids some desktop assets, so its baseline is lighter than the desktop baseline. Both previews transferred fewer reported bytes in this run; this is not a blanket performance improvement claim. No field data or performance guarantee is inferred.

## Screenshots

| Area | Desktop | Mobile |
| --- | --- | --- |
| baseline | [Desktop](screenshots/baseline-desktop.png) | [Mobile](screenshots/baseline-mobile.png) |
| preview-home | [Desktop](screenshots/preview-home-desktop.png) | [Mobile](screenshots/preview-home-mobile.png) |
| preview-enquiry | [Desktop](screenshots/preview-enquiry-desktop.png) | [Mobile](screenshots/preview-enquiry-mobile.png) |
