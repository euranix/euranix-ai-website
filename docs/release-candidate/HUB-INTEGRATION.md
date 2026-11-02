# Hub integration evidence and remaining gate

This candidate implements **website enquiry contract v1** from Euranix Hub commit **778e1e1a4319d76efdef00413667925e34390ba1**, on `codex/website-enquiry-intake`. The user explicitly approved this implemented contract for website development. It is not evidence of a deployed intake service.

- [Contract: docs/website-enquiries-contract.md](https://github.com/euranix/euranixhub/blob/778e1e1a4319d76efdef00413667925e34390ba1/docs/website-enquiries-contract.md)
- [Rollout status](https://github.com/euranix/euranixhub/blob/778e1e1a4319d76efdef00413667925e34390ba1/docs/website-enquiries-rollout.md)
- [Controller](https://github.com/euranix/euranixhub/blob/778e1e1a4319d76efdef00413667925e34390ba1/src/app/Http/Controllers/EnquiryIntakeController.php)
- [Schema](https://github.com/euranix/euranixhub/blob/778e1e1a4319d76efdef00413667925e34390ba1/src/app/Services/Enquiries/EnquirySchema.php)
- [Server configuration](https://github.com/euranix/euranixhub/blob/778e1e1a4319d76efdef00413667925e34390ba1/src/config/enquiries.php)

Hub main was inspected at `fe8be19f81d7f97017e730e5c584b60468fe7183`; the implementation was found on the intake feature branch. Rollout notes said intake is disabled by default and its hostname is not provisioned. The user confirmed staging configuration remains unavailable. No Hub repository, setting, infrastructure or enquiry data was changed.

## Configurable public values

All three values are deliberately empty in `.env.example`.

| Build variable | Required value from Hub/staging owner |
| --- | --- |
| VITE_ENQUIRY_API_URL | Confirmed HTTPS endpoint ending in /api/v1/enquiries |
| VITE_TURNSTILE_SITE_KEY | Approved public site key compatible with the staging frontend hostname |
| VITE_ENQUIRY_PRIVACY_VERSION | Approved, server-allowlisted privacy-notice version |

Vite embeds public build configuration. Supply it before `npm run build`, or as the corresponding Docker build arguments. Changing a container runtime environment alone does not change the static bundle. Never put Turnstile secret keys, Hub credentials or other secrets in VITE variables, Docker public arguments or frontend files.

**Exact local frontend staging/review origins:** `http://127.0.0.1:4373` for euranix.com and `http://127.0.0.1:4374` for euranix.ai. These are bound to loopback and protected from indexing. Any CORS/source and Turnstile hostname allowances must be staging-only, including the exact ports in Origin checks. The Hub owner must confirm Turnstile compatibility with these local hostnames or agree separate HTTPS staging hosts before a live test. No public staging hostname has been invented or provisioned. Ports 4473/4474 are local nginx routing-test endpoints, not proposed Hub frontend origins.

The production bundle contains no fixture endpoint, test key or test-notice version. With configuration absent it presents an honest unavailable message, disables sending and retains `mailto:contact@euranix.com`. It cannot simulate acceptance.

## Implemented behaviour

`src/enquiries/transport.ts` isolates the contract from the UI. HTTPS JSON POST uses credentials=omit, no-store, redirects rejected and an Idempotency-Key UUID v4. Fields use the verified type/service identifiers; source_website is fixed per site and source_page excludes query/fragment. General enquiries, service enquiries, AI demonstrations and one-hour technology-review requests are distinct. An uncertain service is an empty service-interest list.

Privacy acknowledgement is required. Marketing consent is separate and unchecked. Optional phone/WhatsApp numbers belong to the visitor, are validated in international format, and are sent only for the selected preference. Optional contact windows include selected weekdays, ordered times and an IANA time zone. No company WhatsApp or appointment URL was invented.

Turnstile uses explicit rendering and action `website_enquiry`. Expired, failed and timed-out checks clear the token; retry refreshes the challenge. Client validation precedes submission. Error responses have fixed safe copy and field names, not untrusted server message HTML. Retry-After supports seconds and HTTP dates. A 15-second timeout or network/5xx ambiguity keeps the same business payload/key; duplicate in-flight submits are blocked. Changed business content creates a new key. A 409 stops resubmission and directs the visitor to email.

Only HTTP 200/201 with status=accepted and valid UUID receipt_id/request_id can display acceptance. This confirms durable intake according to the contract, not an email delivery, appointment or payment. The key and personal fields remain in memory only. Reloading/closing the page loses the retry state; the failure copy explicitly asks the visitor to keep the page open and avoid starting another request when receipt is uncertain. Durable deduplication across reloads is not claimed.

No enquiry details go to analytics or browser storage. Campaign capture accepts only business-approved values from the five UTM fields. The allowlist is empty because no approved campaign values were supplied; arbitrary query values are discarded. The illustrative homepage interactions do not call Hub. Future CX-to-Hub integration remains outside scope.

## Automated evidence versus live evidence

- [Adapter tests](adapter-tests.json): fake fetch/timers; status mappings, 15-second timeout, concurrent-submit prevention, malformed/edge responses, safe error text, Retry-After, same-key retries and changed-content keys.
- [Browser contract tests](enquiry-contract-tests.json): a separate test build in `.build/contract-dist`; intercepted synthetic Turnstile and Hub responses; eight synthetic requests per site; required fields, consent, intent/service mapping, optional contact preferences, challenge failures, 422/429/503, network retry and acceptance.
- `scripts/enquiry-check.cjs` never overwrites `dist`. Test values exist only in the test build and test source, which are not copied into the runtime Docker image.
- **Live Hub acceptance, backend deduplication, real CORS/preflight, real Turnstile verification and downstream intake visibility: NOT RUN / BLOCKED.** Automated contract responses do not establish those properties.

## Required staging acceptance before release

Obtain the three approved values, staging-only Origin/hostname configuration and enabled contract v1 deployment. Review the notice linked by each site against the approved notice version. Use synthetic test data only on the confirmed staging endpoint. Verify real OPTIONS/POST, 201 durable receipt and stored enquiry visibility; retry the same key/payload with a fresh challenge and verify one record/200 replay. Exercise changed payload/conflict, validation, bot expiry/failure, rate limits, unavailable dependency, timeout and preserved email fallback. Confirm no PII reaches analytics/logging integrations. Record endpoint/version/date, request IDs and evidence in a separate live-integration report. Do not send test enquiries to production.
