# euranix.ai — controlled release

AI deployed; all 129 public checks passed. Genuine apex and www enquiry journeys remain pending. Corporate replay remains explicitly unverified under the user-approved exception.

Current deployed candidate: `4dca061b3527b18dc23bcd82ac1150ea3af7eb5a`.

## Contract and deployment

Contract v1 implementation: `778e1e1a4319d76efdef00413667925e34390ba1`, `docs/website-enquiries-contract.md` in euranix/euranixhub. Confirmed enabled deployment: `742343ac980ebf900480665c2eca2aa69945de05`. Hub receives website enquiries directly; future CX integration is outside this release. Owner and notification recipient are existing Admin user 1/admin@euranix.com, no fallback.

Allowed browser origins are exactly https://www.euranix.com, https://euranix.ai and https://www.euranix.ai. Turnstile action is website_enquiry with a matching hostname. The published privacy notice and configured version are website-enquiries-2026-11-02-v1. Required privacy acknowledgement starts unchecked; optional marketing starts unchecked. Both forms open https://www.euranix.com/privacy#website-enquiries in a separate tab without losing form data.

```dotenv
VITE_ENQUIRY_ENABLED=true
VITE_ENQUIRY_API_URL=https://hub.euranixcloud.com/api/v1/enquiries
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAFw3v3E7oHBjtH0u
VITE_ENQUIRY_PRIVACY_VERSION=website-enquiries-2026-11-02-v1
```

Each first acceptance requires real Turnstile. The browser sets its real Origin automatically, uses credentials:omit, and sends a UUIDv4 Idempotency-Key. The frontend only accepts HTTP 200/201 with the contract's accepted receipt and request IDs. It keeps the same key after an uncertain result if business content has not changed; tokens remain in memory. Hub confirms matching accepted replay is looked up after schema/origin checks and before a second Siteverify, returns the same receipt and creates no duplicate record/notification. Controlled replay uses a fresh genuine token; none is retained in evidence.

Corporate receipt a4eadbc5-0e8e-4b9b-99aa-e5037e7c3864 maps to enquiry/lead/contact 1, correct verified hostname and consent, correct Admin owner, one bell intent and one mail intent. Human confirmed exact inbox delivery. Remaining and later results are recorded in controlled-release-record.json. The human reported notification formatting defects; Hub is handling the minimal rendering correction separately.

Fixtures are confined to local contract tests. Their tests do not contact Hub. An unavailable/disabled intake build displays an email panel instead of unusable fields. Never simulate success in production or use synthetic tokens, localhost origin exceptions or spoofed Origin headers.
