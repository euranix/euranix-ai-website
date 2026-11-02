# Hub enquiry integration — controlled production testing

Updated 2 November 2026 (India time). The user authorised bounded synthetic testing against production Hub; **a separate staging environment is not required**. The user has not authorised merging or deploying either public website. Those are separate permissions.

## Coordination and verified public configuration

The website chat coordinated directly with the existing codex-hub chat. Hub verified its current public Turnstile widget and the exact origin/hostname pairs below. The intake contract v1 originated at **778e1e1a4319d76efdef00413667925e34390ba1**, [docs/website-enquiries-contract.md](https://github.com/euranix/euranixhub/blob/778e1e1a4319d76efdef00413667925e34390ba1/docs/website-enquiries-contract.md). Shared-host deployment work continues from **27ae15e79677f91a4d8b16ce3152bff1812ca426**. The old contract commit is not a deployment recommendation.

| Public build value | Supplied value |
| --- | --- |
| VITE_ENQUIRY_API_URL | https://hub.euranixcloud.com/api/v1/enquiries |
| VITE_TURNSTILE_SITE_KEY | 0x4AAAAAAFw3v3E7oHBjtH0u |
| VITE_ENQUIRY_PRIVACY_VERSION | website-enquiries-2026-11-02-v1 |
| VITE_ENQUIRY_ENABLED | false in these candidates |

The endpoint is confirmed by Hub as the intended production route; a working accepting deployment has **not** been verified by this website project. Hub's inspected live commit was **87107dfaf675126f06f4ca8df23519b54850af77**, with intake not deployed/accepting. The Hub agent is implementing individually granted CRM access and manual retention. Its final release status must be checked before enablement.

All four values are public build-time settings, supplied through .env.production or Docker build arguments; .env.example shows the same defaults. The AI compose build forwards them. Only an explicit VITE_ENQUIRY_ENABLED=true plus complete configuration renders the form. Server credentials, the Turnstile secret and origin-authentication secrets stay with Hub. No secret was requested, copied or placed in a frontend value.

| Allowed browser Origin | Required verified Turnstile hostname |
| --- | --- |
| https://www.euranix.com | www.euranix.com |
| https://euranix.ai | euranix.ai |
| https://www.euranix.ai | www.euranix.ai |

The Hub agent confirmed these from actual served/redirected hosts. Local review at http://127.0.0.1:4373 and :4374 is **not an approved intake origin**. No localhost exception, wildcard CORS, origin spoofing, test-key substitution in production or CAPTCHA bypass is permitted. No approved alternative preview origin was supplied. Real positive candidate submissions therefore require later deployment at an approved public origin.

## Notice and consent

The final supplement belongs at **https://www.euranix.com/privacy#website-enquiries**, preserving the general privacy policy. Candidate publication is not public availability. Hub must not enable intake until the matching exact notice is actually available at that URL. The website release recommendation tracks publication separately from local rendering.

Both enquiry links target that exact URL with target=_blank and rel=noopener noreferrer, with visible “opens in a new tab” wording. A contract browser test fills fields, opens/closes the notice tab and verifies that the entered values and consent state remain intact. Required privacy acknowledgement starts unchecked. Optional marketing consent starts unchecked and is not required for a response.

The final approved notice is now included unchanged in the corporate candidate. Source: Hub docs/privacy/website-enquiries-2026-11-02-v1.md; identifier website-enquiries-2026-11-02-v1. Original supplied-file SHA-256: 9E27323780666CDA123E7A0E445E241445163DA5EF9E3636A047AB8656E971F6; canonical LF SHA-256: 315ecd49f1c278a7a894a122b18f8259ec084c5ded7af2a1b8dccb97f15ff0c9. See [notice provenance, minimal publication patch and rollback constraint](NOTICE-PUBLICATION.md). This text is final; publication, Hub's final release SHA and backend enablement are still pending.

## Disabled intake and service fallbacks

Disabled intake shows a concise email contact panel with contact@euranix.com and no editable fields or unusable send button. It retains the contextual one-hour review offer on the review route. Missing configuration also fails closed.

The existing client/cloud/AI platform links are retained. A visible footer email fallback helps visitors who cannot reach a portal. The original Odoo loader and assets URLs remain; a script-load error produces a clear inline “Live chat could not load” email fallback. Nothing silently routes users to a different portal.

Fresh probes still found HTTP 503 at portal.euranix.com and both chat script URLs, and NXDOMAIN for platform.euranix.ai. The cloud portal returned 200. See external-link-probes.json. These are external-service failures; this task did not alter their infrastructure.

## Implemented contract behaviour

The isolated adapter retains canonical enquiry/service types, optional contact preferences, required acknowledgement, separate optional marketing choice, fixed website/path attribution, real Turnstile action website_enquiry, validation, safe error messages, rate-limit waits, 15-second timeout, UUID v4 idempotency and duplicate in-flight protection. Only 200/201 with an accepted receipt and valid request/receipt UUIDs displays success. A fresh verification token accompanies retries; unchanged business data retains its key. Changed data starts a new key. Retry state is memory-only; keep the page open after an uncertain result.

No enquiry fields enter analytics or browser storage. No campaign values were approved, so the allowlist remains empty. Homepage demonstrations are labelled illustrative/synthetic and never submit enquiries. Future CX-to-Hub integration is excluded.

## Evidence boundary

[Automated browser contract tests](enquiry-contract-tests.json) use a separate build and intercepted synthetic responses. [Adapter tests](adapter-tests.json) use fake fetch/timers. They establish frontend handling, not real Hub acceptance, CRM assignment, inbox delivery or backend duplicate prevention.

Real Turnstile verification, accepted production receipts, CRM record/assignment, actual notification delivery and duplicate-safe production retry are **post-deployment / not run**. Hub additionally reported a missing primary/fallback representative selection and requested it in its own chat; this website task does not infer or assign staff.

See [CONTROLLED-PRODUCTION-TESTS.md](CONTROLLED-PRODUCTION-TESTS.md) for the bounded test plan and the evidence each side must record. No positive production result is claimed.
