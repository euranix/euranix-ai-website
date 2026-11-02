# euranix.ai — controlled release

AI release held until the corporate gate and Hub notification correction pass.

Production remains at `82b749bbdd39d702992f5deb2d48b8a810c7bf58`.

Tested enabled candidate (not deployed): `4dca061b3527b18dc23bcd82ac1150ea3af7eb5a`.

Review the approved application at http://127.0.0.1:4374/ using `npm run preview`; the loopback review server retains noindex isolation and is not a live Hub origin. [Build, deployment and rollback](DEPLOYMENT.md).

The shared design, meaningful synthetic demonstrations, existing routes, general legal content and corrected favicons are preserved. General enquiries and technology-review requests are distinct. Mobile forms follow a short introduction. Privacy is required/unchecked; marketing is optional/unchecked. Disabled intake shows only an email contact panel. No fabricated customer evidence or simulated production acceptance is included.

## Current evidence

- [Release record: commits, genuine receipt and rollback references](RELEASE-RECORD.md)
- [Release checks](release-tests.json): 129 checks, passed=True, base http://127.0.0.1:4474, checked 2026-11-02T19:15:48.126Z.
- [Full assertions](release-checks.json), [route inventory](routes.json), [container byte/redirect checks](container-tests.json).
- [29 adapter contract checks](adapter-tests.json), [20 isolated form test groups](enquiry-contract-tests.json), [preserved assets/legal policy/favicons](preservation.json).
- [Homepage desktop](screenshots/home-desktop.png) / [mobile](screenshots/home-mobile.png).
- [Contact desktop](screenshots/contact-desktop.png) / [mobile](screenshots/contact-mobile.png).
- [Technology review desktop](screenshots/technology-review-desktop.png) / [mobile](screenshots/technology-review-mobile.png).
- [Hub contract and live-test boundary](HUB-INTEGRATION.md), [published notice](NOTICE-PUBLICATION.md), [bounded genuine tests](CONTROLLED-PRODUCTION-TESTS.md).
- [Release recommendation and unresolved issues](RELEASE-RECOMMENDATION.md).

Deterministic screenshots/layout/axe tests block external scripts, so the Turnstile error in those screenshots is an intentionally blocked-script state. Synthetic form fixtures never submit to Hub. Genuine receipt/CRM/inbox/replay results are separately recorded. Automated axe does not replace assistive-technology user testing; CSS zoom checks do not cover every OS/browser combination. Earlier [performance measurements](performance.json) remain historical, not measurements of this deployed build. This was not a comprehensive dependency/security audit.

Portal/chat HTTP 503 and the AI-platform DNS failure remain documented, explicitly permitted outages with email fallbacks. Do not replace the existing destinations silently. No approved service starting prices exist: use Request pricing. Preserve the confirmed one-hour review offer (temporarily free; future US$199; no deadline, billing or appointment promise). Do not invent WhatsApp/booking values. Future CX integration remains outside this release.
