# euranix.ai — controlled release

AI release held until the corporate gate and Hub notification correction pass.

Production remains at `82b749bbdd39d702992f5deb2d48b8a810c7bf58`.

Tested enabled candidate (not deployed): `4dca061b3527b18dc23bcd82ac1150ea3af7eb5a`.

Do not claim both websites complete until both genuine enquiry journeys pass. Corporate must pass real Turnstile acceptance, assignment to admin@euranix.com/user 1 with no fallback, human-confirmed inbox delivery and same-key replay before AI deployment. Keep the AI site unchanged until that gate passes. Resolve the reported Hub email-rendering defect through its coordinated corrective release; do not resend an accepted enquiry to test formatting.

Portal and chat remain HTTP 503; platform.euranix.ai still fails DNS resolution. The user explicitly permits these existing outages for this release with the visible contact@euranix.com fallbacks. Original destinations remain linked. These outages are unresolved, and unauthenticated probes do not prove authenticated portal function.

The corporate first attempt exposed CDN email rewriting that caused React hydration mismatches. It was rolled back to the notice-only image, corrected with Cache-Control:no-transform and re-released. All 578 corrected corporate public checks passed. [Cloudflare documents this header behavior](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/).

Use [the exact release record](controlled-release-record.json), [test evidence](release-tests.json) and [rollback instructions](DEPLOYMENT.md). Automated layout/contract checks and genuine live acceptance are separate evidence. No synthetic production success, CAPTCHA bypass, fabricated origins, production load test, DNS change or main-branch merge is part of this release.
