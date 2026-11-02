# euranix.ai — controlled release

AI deployed; 129 public checks and both genuine origin acceptances, assignment and human-confirmed inbox/format checks passed. AI replay remains unverified after browser closure and the Computer Use URL-verification stop; final release validation remains open.

Current deployed candidate: `4dca061b3527b18dc23bcd82ac1150ea3af7eb5a`.

The human explicitly authorised proceeding with corporate duplicate-safe replay unverified. This is a release exception, not a successful replay test. Corporate genuine Turnstile acceptance, correct assignment to admin@euranix.com/user 1 with no fallback, human-confirmed inbox delivery and public checks passed. Both AI serving origins passed genuine Turnstile acceptance, correct Admin assignment and actual inbox delivery. The human confirmed the revised email formatting is good. Hub correction `9b892b3996af42ec3ab0eb7b0f4695525e1b4af6` is live and healthy. AI replay remains unverified after browser closure and the Computer Use URL-verification stop; final release validation remains open. Unchanged read-only record counts do not establish replay success.

Portal and chat remain HTTP 503; platform.euranix.ai still fails DNS resolution. The user explicitly permits these existing outages for this release with the visible contact@euranix.com fallbacks. Original destinations remain linked. These outages are unresolved, and unauthenticated probes do not prove authenticated portal function.

The corporate first attempt exposed CDN email rewriting that caused React hydration mismatches. It was rolled back to the notice-only image, corrected with Cache-Control:no-transform and re-released. All 578 corrected corporate public checks passed. [Cloudflare documents this header behavior](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/).

Use [the exact release record](controlled-release-record.json), [test evidence](release-tests.json) and [rollback instructions](DEPLOYMENT.md). Automated layout/contract checks and genuine live acceptance are separate evidence. No synthetic production success, CAPTCHA bypass, fabricated origins, production load test, DNS change or main-branch merge is part of this release.
