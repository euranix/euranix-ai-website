# Independent deployment and rollback: euranix.ai

These are instructions for a later approved release. **No public website merge, hosting change, DNS change or deployment was performed by this website task. Hub deployment is coordinated separately by the Hub agent.** The draft PR must remain unmerged until the Hub and external-service gates are resolved. Do not deploy both websites as one operation.

## Review this candidate locally

Use the existing checkout on `codex/flagship-design-review`. Node 22.13+ is supported by the tooling; Docker builders use Node 22 Alpine. Local verification used Node 24.18.0. `.nvmrc` selects 22.

```powershell
git fetch origin
git switch codex/flagship-design-review
git pull --ff-only
npm ci
npm run typecheck
npm run lint
npm run build
npm run preview
```

Open **http://127.0.0.1:4374/**. The complete app is at its real URLs; `/design-review/` is retired. Review runs on loopback and sends X-Robots-Tag noindex/nofollow/noarchive, replaces the HTML robots tag and disallows crawling. It does not modify `dist` or production nginx. The disabled build shows an email-only panel. These loopback URLs are for isolated review and are NOT approved Hub enquiry origins.

Controlled production testing is authorised. Hub permits only https://www.euranix.com, https://euranix.ai and https://www.euranix.ai, with matching Turnstile hostnames. Do not enable intake on localhost or add origin exceptions. The supplied production public values are recorded in .env.production and Docker build arguments, with VITE_ENQUIRY_ENABLED=false. Real positive tests remain post-deployment until the notice and candidate forms are served on approved origins. See CONTROLLED-PRODUCTION-TESTS.md.

## Repeat verification

```powershell
npm run typecheck
npm run lint
npm run build
node scripts/preservation-check.cjs
node scripts/enquiry-adapter-check.cjs
```

Browser tooling is intentionally outside runtime dependencies. Create a separate tooling directory, install Playwright and axe-core there, and set `REVIEW_TOOL_ROOT` to its absolute path. The recorded run uses Edge installed on Windows (`channel: msedge`). Its package versions are in the evidence summary. For example:

```powershell
$env:REVIEW_TOOL_ROOT='C:\path\to\review-tools'
npm run test:enquiries
docker build -t euranix-ai-website:rc-review .
docker run --rm -d --name euranix-ai-rc-routing -p 127.0.0.1:4474:80 euranix-ai-website:rc-review
$env:RELEASE_BASE='http://127.0.0.1:4474'
npm run test:release
npm run test:container
docker stop euranix-ai-rc-routing
```

Keep `npm run preview` running in a second terminal for the review-isolation checks. The routing container intentionally tests production indexing rules and is restricted to loopback. Do not expose this local routing container as an unapproved intake origin. The tests never send a real Hub enquiry. Screenshots and JSON evidence are written to `docs/release-candidate`.

## Notice publication before intake

The final notice is prepared in the corporate candidate, with a separate minimal publication patch against production main. See [NOTICE-PUBLICATION.md](NOTICE-PUBLICATION.md). Neither artifact is a public deployment. The user has not authorised website deployment in this task; publish only through a later approved release and verify the public anchor before Hub enablement.

## Later release, only after approval

1. Resolve the gates in README and HUB-INTEGRATION, including approved notice publication and Hub deployment/assignment and the live portal/chat/AI-platform failures. Review the exact final commit/diff and site-specific configuration.
2. Record this site's currently deployed image digest, commit, environment and reverse-proxy settings in the release record. Confirm the actual Coolify resource, branch triggers and build method before using it; those settings were not accessible here. Do not create a replacement resource or alter DNS as a shortcut.
3. Build and tag the approved commit for **this repository only**. Pass the confirmed production public values as `--build-arg VITE_ENQUIRY_API_URL`, `--build-arg VITE_TURNSTILE_SITE_KEY` and `--build-arg VITE_ENQUIRY_PRIVACY_VERSION`. The existing docker-compose.yml forwards these build arguments, with empty defaults; preserve its service, exposure and restart settings. The supplied public defaults are populated; VITE_ENQUIRY_ENABLED=false explicitly disables intake. Pass VITE_ENQUIRY_ENABLED=true only after notice publication and verified Hub enablement, during an approved website release. Never use a synthetic test build for deployment.
4. The runtime image contains only nginx and `dist`, not source tests, fixtures, npm, local documentation or SSR tooling. Treat the built image as the release artifact; public configuration changes require rebuilding it.
5. Deploy that approved immutable image through the existing site resource. Preserve existing apex/www and HTTPS redirects at the edge. The local nginx config does not replace edge hostname/TLS policy.
6. Smoke-test home, every indexed route, refreshes, old URLs, assets, metadata, robots and sitemap on the actual hostname. Test an unrelated missing route and missing asset for 404. Check index.html/trailing-slash redirects, original verification asset where applicable, email, portals and chat. Confirm public responses have no staging noindex headers and that /studio remains intentionally noindex on .com.
7. Run the approved production operational check only under the owner's separate release procedure; the user now authorises bounded synthetic enquiries using contact@euranix.com; no load tests or unrelated mail changes are authorised. Actual approved public origins and real Turnstile verification remain mandatory. Monitor errors, intake receipts and crawler/analytics behaviour using existing operational tooling. Search Console/analytics accounts were not available for this review.
8. Review the result before scheduling the other website. The sites can roll forward or back independently.

## Roll back this site only

First preserve the published website-enquiry notice across rollback. If an older corporate image lacks it, do not remove the notice while Hub or either website can accept enquiries; coordinate with Hub and use a known-good image with the supplement retained. See NOTICE-PUBLICATION.md. For intake-only problems, rebuild this site with VITE_ENQUIRY_ENABLED=false to restore the email panel, while retaining routes and notice.

Restore the previously recorded immutable image/digest and its matching public configuration through the same Coolify resource. Do not force-reset main and do not roll back Hub, the other website or DNS. Verify the old site's routes, email, portal/chat links and metadata after switching. Retain release logs and diagnose the failed candidate separately.

The recorded repository baseline is **75802365f8811093c9043632c860aa5838e5465f**. If no known-good image remains, build that exact commit in an isolated checkout after approval and restore the matching old configuration; prefer the previous deployed image because dependency/base-image tags can change. There are no website database migrations to reverse. Requests already durably accepted by Hub remain backend records; rolling back a website must not delete or resubmit them.
