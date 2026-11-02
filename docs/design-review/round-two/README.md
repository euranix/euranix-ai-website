# Second design refinement

Reviewed 2 November 2026. Preview-only work on the existing `codex/flagship-design-review` branch. No merge, deployment or redesign of additional production pages is part of this round. This is not production readiness evidence.

## Review findings addressed

1. The mobile enquiry order is short introduction → form → supporting information. The form panel starts at y=298px on a 390×844 viewport on both sites. General enquiries do not show the technology-review offer. Selecting a review adds a short contextual explanation and the detailed offer after the form on mobile.
2. Customer copy now explains the service directly. Removed source-document commentary, catalogue/audit language and internal release-policy wording from the proposed copy. Explicit design-review, fixture, synthetic-source and illustrative-process labels remain.
3. General enquiry and technology-review request are separate intent choices. “Not sure — help me choose” is the default service choice; all seven verticals remain available. Follow-up preference and time/time zone are optional; email is the confirmed contact channel. Marketing remains optional and unchecked. The existing service query URLs still work, including `?service=Technology%20review`.
4. Reduced mobile hero typography, section padding, gaps and demo panel padding; removed the old response minimum height. Service/use-case discovery begins at 1361px on the 390px-wide homepage. Mobile enquiry introductory content is short, without a large offer panel ahead of the form.
5. The portfolio homepage now demonstrates capture → assignment → follow-through for a synthetic enquiry or support request. The AI homepage shows the sample source, access boundary and response, with referenced answer, missing information, restricted access and human handover states. Restricted mode hides the excerpt; all states are explicitly synthetic. No live AI check, customer proof, request creation or message delivery is represented.
6. The software lifecycle uses consistent grid columns and first-line baseline alignment. All six rows were checked at 1440, 1280 and 1024px. Additional 125%/200% CSS zoom and equivalent 1152/720px reflow checks found no overlap or horizontal overflow. These are CSS zoom/reflow checks in Edge, not browser-chrome zoom certification.
7. The final software action is “Discuss your software project” and opens a general enquiry with Custom Software Engineering selected.
8. Header Escape handling now checks whether the menu is open. Escape from an open menu closes it and returns focus to the menu button; Escape while it is closed leaves focus in the enquiry field. The skip link stays hidden until keyboard focus, including in the zoom captures.

The shared components, design tokens, interaction patterns and scoped refinement styles are identical in the independent repositories; site identity remains in each repository's existing site configuration. No new runtime dependencies or external image services were introduced.

## Preview instructions

In each repository on the existing preview branch:

```powershell
npm ci
npm run build
npm run build:review
npm run preview:review
```

Skip `npm ci` when dependencies are already installed. The server binds only to 127.0.0.1.

- [AI homepage](http://127.0.0.1:4274/design-review/)
- [General enquiry](http://127.0.0.1:4274/design-review/enquiry)
- [Technology-review request](http://127.0.0.1:4274/design-review/enquiry?intent=technology-review)

The unchanged original website remains at the server root. Cross-domain and existing portal/contact links keep their existing destinations. No public preview hosting was added.

Use sample details only. Choose the labelled review controls to inspect unavailable, interrupted and simulated-success outcomes. No form values are sent or saved; simulated success says “Test complete — nothing was sent.” The real contact email is preserved. Contact preferences are local domain-model fields, not an agreed Hub wire schema.

## Test evidence

- [Browser and accessibility results](preview-checks.json): all routes at 1440×1000 and 390×844; zero detected axe WCAG A/AA violations, console errors, broken local links/assets or overflow. Includes navigation, skip link, fixture outcomes, validation/focus, loading/disabled state, retry preservation, consent defaults, reduced motion, preview 404s and robots checks. Automated checks do not certify complete accessibility.
- [Refinement results](refinement-checks.json): form order/position, intent and legacy-query mapping, optional preferences, contextual offer, Escape focus behaviour and interactive demo boundaries. Extra 320/768/1024px route checks passed.
- [Isolation and production preservation](isolation-checks.json): all 8 standard-build files have identical SHA-256 hashes to the recorded production baseline. Fixtures reject production mode and a non-loopback test origin, even when simulated success is selected. The Hub adapter remains disconnected; zero network submissions; original root returns 200.
- [Build, type and lint output](validation-output.txt): standard and preview builds, full and preview TypeScript checks passed. AI preview lint passed using the portfolio repository’s existing ESLint config and executable. Existing build notices remain recorded.
- [Local performance observations](preview-performance.json): three runs per viewport using fresh Edge contexts and 4× CPU throttling. These runs overlapped other checks and are not a controlled comparison with round one or field Core Web Vitals.

The screenshot set was visually reviewed for form order, demo clarity, mobile wrapping and software row alignment. The first round's evidence remains untouched in the parent directory.

To repeat browser checks, install `playwright` and `@axe-core/playwright` in a separate tooling directory, set `REVIEW_TOOL_ROOT` to it, and use installed Microsoft Edge:

```powershell
$env:REVIEW_EVIDENCE_DIR = 'docs/design-review/round-two'
node scripts/review-check.cjs
node scripts/review-refinement-check.cjs
node scripts/review-isolation-check.cjs
```

## Updated screenshots

Full-page default-state captures:

| Area | Desktop | Mobile |
| --- | --- | --- |
| Homepage | [Desktop](screenshots/preview-home-desktop.png) | [Mobile](screenshots/preview-home-mobile.png) |
| General enquiry | [Desktop](screenshots/preview-enquiry-desktop.png) | [Mobile](screenshots/preview-enquiry-mobile.png) |

Additional interactive states:

| Area | Desktop | Mobile |
| --- | --- | --- |
| Review request + contact preferences | [Desktop](screenshots/review-request-desktop.png) | [Mobile](screenshots/review-request-mobile.png) |
| AI human handover | [Desktop](screenshots/demo-interaction-desktop.png) | [Mobile](screenshots/demo-interaction-mobile.png) |


## Release requirements — still open

- **Production SEO:** fix route-specific titles, descriptions and canonicals; use the correct host for each domain; resolve soft 404s; confirm robots/sitemaps, live redirects and crawler-visible content. Verify real deployment, Search Console and analytics/consent evidence. Existing production SEO was deliberately preserved during this preview; its baseline findings remain in [the original review](../README.md#baseline-evidence-and-seo-findings).
- **Final Hub integration:** obtain the final implemented contract, map enquiry intent and optional preferences, and verify server validation, anti-bot handling, attribution, consent/privacy, idempotency, timeouts/retries and durable acceptance. Only a durable backend receipt can drive a real success state. Fixtures must never submit real enquiries or simulate production acceptance. Hub receives enquiries directly; future Euranix CX integration is outside scope.
- Confirm service prices and scope before replacing “Request pricing.” Original AI prices remain recorded for review. Preserve the one-hour review offer: free for a limited period, future US$199, no invented expiry, countdown, billing or confirmed appointment.
- Preserve and verify original contact, portal and chat behaviour during any later rollout. No WhatsApp number or external booking URL has been found or invented. Complete AI capability/legal validation, wider browser/assistive-technology testing and separately approved rollout planning before production release.
