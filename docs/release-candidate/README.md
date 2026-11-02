# euranix.ai — full-site release candidate

**Implemented for review on codex/flagship-design-review. Not merged, not deployed, not production-ready.** The refined design now runs at the real application URLs. The former design-review app and fixture controls have been removed; historical evidence is retained.

## Review and scope

Open **http://127.0.0.1:4374/** on this computer. It is currently running on loopback. To recreate it, run npm ci, npm run build, then npm run preview. [Full instructions, staging configuration, independent deployment and rollback](DEPLOYMENT.md). The production build is separate from the noindex review server.

The managed AI homepage covers knowledge, customer support and business information; preserves the existing important anchors and supported capability categories; provides scoped pricing enquiries, contact and technology-review journeys; and cross-links to the corporate portfolio.

The shared design uses production components for layout, CTA, illustrated workflows and enquiry handling. Both repositories remain independently buildable and deployable. There is one application per site. General enquiries remain distinct from review requests; the mobile form follows a short introduction. Examples retain explicit illustrative/synthetic labels. There is no fabricated customer evidence or simulated production acceptance.

## Review artifacts

- [Complete before/after route inventory, SEO comparison, redirect map and every screenshot](SEO-AND-ROUTES.md)
- [Homepage desktop](screenshots/home-desktop.png) / [mobile](screenshots/home-mobile.png)
- [Contact desktop](screenshots/contact-desktop.png) / [mobile](screenshots/contact-mobile.png)
- [Technology review desktop](screenshots/technology-review-desktop.png) / [mobile](screenshots/technology-review-mobile.png)
- [Implemented Hub contract, exact SHA, configuration and test boundary](HUB-INTEGRATION.md)
- [Independent release and rollback procedure](DEPLOYMENT.md)

## Verification evidence

| Check | Result |
| --- | --- |
| TypeScript / production build / Docker build / nginx config | Passed; [build details and warnings](build-checks.json) |
| Lint | Zero errors; zero warnings |
| Production-like browser checks | 114 passed across 3 routes; [summary](release-tests.json), [assertions](release-checks.json) |
| Desktop/mobile screenshots | 6 current screenshots; 1440×1000 and 390×844 viewports |
| Accessibility/layout | No detected axe WCAG A/AA violations; no horizontal overflow at 320/390/768/1024/1440px; keyboard menu/Escape, skip link and reduced-motion checks |
| Actual runtime container | 21 response/hash/redirect checks; nginx 1.30.6; production bytes match local tested build; [evidence](container-tests.json) |
| Enquiry adapter | 29 synthetic checks; [report](adapter-tests.json) |
| Browser form contract | 16 check groups, 8 intercepted requests; [report](enquiry-contract-tests.json) |
| Preserved assets and legal content | Passed; [baseline comparisons and favicon dimensions](preservation.json) |
| Live Hub integration | BLOCKED; not run; contract tests are not live acceptance |
| External links / chat | [Live probes](external-link-probes.json); failures below remain release dependencies |
| Whitespace | git diff --check passed |

The Docker image contains only built static files and nginx. The standard bundle has no synthetic endpoint/key/notice version or fixture controls. Both initial HTML and hydrated pages carry page-specific metadata. Known pages return 200, unrelated pages/assets return 404, and staging indexing restrictions do not enter production output. The corporate Google verification file is directly accessible. Studio pause/resume and software row alignment at desktop/CSS zoom were also checked on .com.

Automated accessibility checks are not a substitute for assistive-technology user testing. The deterministic browser run blocks external scripts; real external HTTP probes are separate. No real enquiry was submitted to any Hub endpoint. This was functional/build verification, not a comprehensive dependency or security audit.

## Controlled performance comparison

Three fresh-context runs per version/device, alternating old and new, on the same local gzip server and browser. Desktop: 1440×1000, CPU 1×, 20ms latency, 10Mbit/s. Mobile: 390×844, CPU 4×, 100ms latency, 1.6Mbit/s. Cache disabled, reduced motion, external requests blocked equally. No builds or other browser test runs ran alongside the measurement. Values below are medians; [all runs and limitations](performance.json).

| Device / version | FCP ms | LCP ms | CLS | Long tasks ms | Encoded bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| desktop / baseline | 184 | 416 | 0 | 0 | 123516 |
| desktop / candidate | 348 | 348 | 0 | 0 | 132683 |
| mobile / baseline | 508 | 1708 | 0.002 | 247 | 123516 |
| mobile / candidate | 1396 | 1396 | 0 | 76 | 132683 |

Candidate LCP and long-task time improved in this local comparison, but FCP and document-load timing were slower and bytes increased. Do not present this as a universal speed improvement.
These are local laboratory measurements, not real-user guarantees, field Core Web Vitals or a Lighthouse score. Only the initial homepage viewport was measured; there is no field INP measurement. The original production build snapshots were preserved before implementation. To repeat, build the recorded baseline commit separately, set BASELINE_DIST to its output and REVIEW_TOOL_ROOT to the browser tooling directory, then run npm run test:performance.

## Remaining release requirements

1. **Hub staging:** confirmed HTTPS endpoint, public Turnstile key, approved privacy-notice version, enabled contract v1 service and staging-only source/Origin allowances. Exact frontend origins proposed for local staging are http://127.0.0.1:4373 and http://127.0.0.1:4374. Confirm compatible Turnstile hostnames or agree HTTPS staging hosts. Then prove real acceptance, stored record visibility and backend duplicate prevention. The current candidate keeps online submission disabled and email available.
2. **Existing external services:** portal.euranix.com and both Odoo chat script URLs returned HTTP 503 on 2 November 2026; platform.euranix.ai failed DNS resolution from this environment. Preserve the links but resolve/recheck availability before release. euranixcloud.com and both current public homepages returned 200. HTTP probes do not establish authenticated portal or chat functionality.
3. **Business/legal configuration:** approve the notice version and confirm AI-specific processing/support scope. No service starting prices have been approved; “Request pricing” remains. Existing AI $199/$499 offers and package claims are explicitly recorded for review in the SEO/content inventory. No WhatsApp/booking destination was found or invented. Campaign attribution allowlist stays empty until approved.
4. **Final release review:** approve these complete pages, verify the actual hosting resource/build arguments and edge redirects, perform live crawler/social/verification checks after approved deployment, and review existing analytics/Search Console configuration with the owner. No access to those accounts or hosting controls was assumed.

The confirmed one-hour review remains free for a limited period, future standard fee US$199, with no deadline, automatic billing or appointment promise. Future CX-to-Hub work is excluded. Production main branches and infrastructure remain unchanged.

## Source references

The user’s latest brief and clarifications take precedence over the service-portfolio strategy. Implementation references: [Vite SSR](https://vite.dev/guide/ssr.html), [Turnstile explicit rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/) and [Node release status](https://nodejs.org/en/about/previous-releases). Docker builders moved from the old Node 18/20 bases to Node 22 LTS to support the installed tooling; React/Vite were not migrated.
