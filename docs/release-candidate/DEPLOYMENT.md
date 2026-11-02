# euranix.ai — controlled release

AI deployed; 129 public checks and both genuine origin acceptances, assignment and human-confirmed inbox/format checks passed. AI replay remains unverified after browser closure and the Computer Use URL-verification stop; final release validation remains open.

Current deployed candidate: `4dca061b3527b18dc23bcd82ac1150ea3af7eb5a`.

## Public build configuration

```dotenv
VITE_ENQUIRY_ENABLED=true
VITE_ENQUIRY_API_URL=https://hub.euranixcloud.com/api/v1/enquiries
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAFw3v3E7oHBjtH0u
VITE_ENQUIRY_PRIVACY_VERSION=website-enquiries-2026-11-02-v1
```

The values are public compile-time settings. Never add Hub/Cloudflare secrets to VITE configuration. Rebuild after changing intake configuration; nginx runtime variables cannot change an existing bundle. The existing Coolify resource `d46t4c1cy51p1b2iab8vyeb4` remains the sole deployment target. Preserve its domain mapping, TLS, compose service/port and source repository. Pin the exact tested full commit instead of following an unreviewed HEAD.

## Review and verification

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:adapter`, `npm run test:preservation`, then `npm run preview`. Review at http://127.0.0.1:4374/. The review server keeps its noindex/nofollow/noarchive headers and disallowed robots output. Localhost is not an approved Hub origin and must not be used for genuine intake.

For browser tests, set REVIEW_TOOL_ROOT to the separate directory containing Playwright and axe. Use EXPECTED_ENQUIRY_ENABLED=true for an enabled build and omit/set false for a disabled build. `test:enquiries` uses isolated fixtures; `test:release` blocks external scripts and checks routes/layout/SEO; `test:container` verifies exact built bytes and nginx behavior. None of these alone proves live intake. Controlled genuine tests use the final public origins only; see CONTROLLED-PRODUCTION-TESTS.md.

## Rollback

Pre-release production commit: `82b749bbdd39d702992f5deb2d48b8a810c7bf58`. Image: `d46t4c1cy51p1b2iab8vyeb4_euranix-ai:82b749bbdd39d702992f5deb2d48b8a810c7bf58`. Archive on the existing production server: `/data/coolify/website-release-2026-11-03/ai-before.tar` (SHA256 `7da85267872179bb8a3f60608e8a74082836d89d0999eb2932048f779bea2864`). Exact original configuration is recorded in controlled-release-record.json. Do not run cleanup on this archive during the release.

For intake-only failures, rebuild with the explicit build argument VITE_ENQUIRY_ENABLED=false and deploy through the same resource; confirm all editable fields are replaced by the email contact panel. Rebuild source reference: `6d262c9909b97756d9e6f775d75cf4c4f0e21099` (the explicit false argument overrides release defaults). Locally tested fallback images are also archived with the release artifacts. Preserve the CDN no-transform correction when making a new fallback build.

For broader regressions, restore the saved original image/configuration. Corporate rollback must use ff9cca62709d0d9577eaaa55f50af25f8bc97e2b or another verified image retaining the published notice; never use its older pre-notice images. Corporate Coolify's rollback control was exercised successfully at 19:04:15 UTC on 2 November. AI's Compose resource did not list rollback images, so its actual running image and private runtime configuration were archived before release. If an image has been pruned, load the saved tar before restoring the matching compose/image configuration. Restore the matching Git source pin too, so a subsequent push does not reintroduce the failed candidate.

Recheck home, contact, notice, direct routes, missing-route 404, assets, redirects, metadata, robots/sitemap and email contact after rollback. Do not change DNS, roll back Hub, delete accepted records, re-send enquiries or remove the privacy notice. No website database migration is involved.
