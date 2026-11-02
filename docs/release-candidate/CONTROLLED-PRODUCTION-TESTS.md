# Controlled production end-to-end verification

**Authorised by the user, but not executed from these undeployed candidates.** No separate staging environment is required. These checks are explicitly post-deployment because Hub permits only the actual public website origins.

## Prerequisites and sequence

1. Publish the approved notice, unchanged, at https://www.euranix.com/privacy#website-enquiries. Verify its version and exact body publicly. The prepared candidate section alone does not meet this gate.
2. Obtain the Hub agent's final deployed full SHA, enabled intake status, confirmed primary admin@euranix.com (user ID 1), no fallback, individual CRM access and unchanged notification recipients. CRM access and assignment are separate decisions.
3. After separate website deployment approval, serve the reviewed candidate from https://www.euranix.com and https://euranix.ai. If www.euranix.ai continues serving the same candidate, verify that exact origin/hostname pair as well. Never alter the Origin header or proxy localhost as an approved browser.
4. Configure the supplied public values and enable the form only when the notice and accepting backend are ready. Keep the email panel available by rebuilding with VITE_ENQUIRY_ENABLED=false if those prerequisites fail.
5. Complete genuine Turnstile verification in a normal browser. If it asks for human interaction, the reviewer completes that interaction. No challenge bypass or synthetic token is valid for this live test.

## Bounded synthetic cases

Use one labelled enquiry from each site, plus one same-key retry for each. No load tests, real customer details, invented phone numbers, automatic marketing opt-in or unrelated SMTP changes.

| Field | Corporate case | AI case |
| --- | --- | --- |
| Name | Synthetic website verification COM | Synthetic website verification AI |
| Email | contact@euranix.com | contact@euranix.com |
| Company | Euranix integration verification — synthetic | Euranix integration verification — synthetic |
| Type | general_sales | ai_demo |
| Service | Empty / not sure | managed-ai |
| Message | SYNTHETIC WEBSITE CHECK — COM — unique run ID. Controlled integration test; no sales action required. | SYNTHETIC WEBSITE CHECK — AI — unique run ID. Controlled integration test; no sales action required. |
| Privacy | Reviewer reads and explicitly acknowledges published v1 | Same |
| Marketing | Unchecked / false | Unchecked / false |
| Contact method | Email | Email |

Do not send these automatically before the prerequisites and separate website-deployment approval are satisfied.

## Record frontend and CRM evidence separately

- Browser: exact URL/Origin and timestamp, real verification action/hostname, network status, request_id, receipt_id and idempotency key. Do not retain a reusable bot token or dump unrelated browser data.
- Hub agent: find the matching synthetic record/receipt and confirm source, type, service, contact address, acknowledged notice version, false marketing choice, assigned representative and expected tenant. Confirm unauthorised Members cannot read it; access checks are Hub-owned.
- Notifications: verify the expected internal notification and email to the already configured recipient. A queued/sent log or SMTP acceptance alone is not proof of inbox delivery. Capture the actual inbox/provider delivery evidence or mark that part pending.
- Duplicate safety: use a fresh Turnstile token with the same idempotency key and identical business payload. The normal frontend retains this key after an uncertain result; keep the same page open. A reviewer may deliberately lose the first response in a controlled browser test after Hub confirms receipt, then use Retry enquiry. Confirm 200 replay, the same receipt, exactly one CRM enquiry/lead creation and no duplicate notification delivery. Do not use “Start another enquiry,” edit the payload or replay a consumed token.
- Closing record: correlate both site receipts with the Hub agent's evidence, actual delivery proof and final duplicate counts. Apply the Hub-approved synthetic-record cleanup/90-day retention procedure; do not delete unrelated CRM records or audit evidence.

## Current result

| Check | Status |
| --- | --- |
| Exact public configuration and allowed origins obtained from Hub | Confirmed; endpoint acceptance not yet verified |
| Candidate form/disabled-state/notice-tab regression | Automated evidence in enquiry-contract-tests.json and release-tests.json |
| Notice publicly available | Not yet; candidate changes are not deployed |
| Real Turnstile verification from both candidates | Post-deployment — not run |
| Production accepted receipts | Post-deployment — not run |
| Correct Hub record and assignment | Post-deployment — not run; primary selected by the user; live assignment unverified |
| Notification delivered | Post-deployment — not run |
| Backend duplicate-safe retry / one notification | Post-deployment — not run |
