# Release recommendation — hold public promotion

The enquiry changes are ready for code/design review. **Do not merge or deploy either public website in this task. Do not describe these candidates as production-ready.** Public intake stays off; the rebuilt candidates display a working email contact panel. The approved design, routes, SEO safeguards, original portal destinations and corrected favicons remain intact.

## Completed evidence

Both builds contain Hub's public endpoint, widget key and approved notice version as build-time values, with an explicit off switch. No server secrets are included. The corporate candidate contains the exact final approved notice at /privacy#website-enquiries and preserves the general policy. Consent defaults and new-tab data preservation passed isolated browser contract checks. Footer portal help and a corporate chat script-failure fallback provide the confirmed email without replacing services.

This site: **120 production-like browser checks across 3 routes**, 20 isolated form-contract groups, matching local/container production bytes, TypeScript/lint/build/preservation checks and fresh desktop/mobile screenshots. See README.md for linked evidence and limitations. The original adapter suite has 29 checks; adapter code is unchanged by this update. Previous performance measurements are explicitly labelled with their older commit. Current automated tests do not prove live Hub acceptance.

## Release sequence requiring review

1. Review/publish the approved notice using the corporate minimal patch or a separately approved disabled candidate. Verify the exact public text/version. It is currently candidate-only.
2. Hub must supply its final deployed full SHA, confirm intake enablement, primary/fallback representatives, individual CRM access and notification recipients. The last verified live Hub SHA is 87107dfaf675126f06f4ca8df23519b54850af77; intake was not deployed/accepting. Ongoing Hub work is separate from website readiness.
3. Resolve or explicitly accept the documented portal/chat 503 and AI platform NXDOMAIN failures; preserve original destinations and the visible email fallback. A 200 response alone does not prove authenticated portal behaviour.
4. Approve one website release at a time. Rebuild with VITE_ENQUIRY_ENABLED=true only once the public notice and accepting Hub are verified. Use the established site resource and approved origin; do not add localhost, spoof origins or bypass Turnstile.
5. Execute the bounded tests in CONTROLLED-PRODUCTION-TESTS.md with contact@euranix.com and clearly labelled synthetic records. Correlate real Turnstile, accepted receipt, correct CRM record/assignment, actual notification delivery and same-key duplicate-safe retry with the Hub agent. These are **post-deployment / not run** from these candidates.
6. Verify production edge redirects, public SEO/crawler/social outputs and owner-held analytics/Search Console configuration. Local SEO checks passed; live deployment checks have not.

Approved origins: **https://www.euranix.com**, **https://euranix.ai**, **https://www.euranix.ai**, each with the matching Turnstile hostname. No alternate preview origin is approved. No real or synthetic enquiry was submitted to production by this website task.

## Rollback for review

Record each site's pre-release immutable image digest, full commit and public build settings before promotion. For an enquiry issue, rebuild with the off switch and verify the email panel. For broader regressions, restore that site's known-good image through the existing resource, independently of the other site. Preserve the published notice; never roll it away while intake can accept acknowledgements. Do not reset main, change DNS, roll back Hub or delete/replay accepted records. See DEPLOYMENT.md and NOTICE-PUBLICATION.md for the full sequence and baseline SHA.
