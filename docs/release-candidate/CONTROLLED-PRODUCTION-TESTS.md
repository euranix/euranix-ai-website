# euranix.ai — controlled release

AI release held until the corporate gate and Hub notification correction pass.

Production remains at `82b749bbdd39d702992f5deb2d48b8a810c7bf58`.

Tested enabled candidate (not deployed): `4dca061b3527b18dc23bcd82ac1150ea3af7eb5a`.

Controlled production testing is authorised. No separate staging system is required. The exact approved frontend origins are https://www.euranix.com, https://euranix.ai and https://www.euranix.ai; verify actual redirects and test each origin that continues serving forms. Never spoof origins or weaken Turnstile.

Use one clearly labelled synthetic enquiry per serving origin with contact@euranix.com and marketing false, then retry the same accepted key with identical normalized business/consent/source values and a fresh genuine token. Names are EURANIX TEST — Website enquiry 001 (corporate), 002 (AI apex) and 003 only if AI www independently serves forms. Do not click Start another enquiry for a retry.

The user explicitly approved the prepared single-request Playwright replay helper. It opens the actual public origin, waits for genuine Turnstile and uses browser-native fetch; no Origin override, interception or fabricated token. If a human challenge appears, complete it through the applicable action-time confirmation/handoff. A timeout sends no enquiry and is not evidence of replay success. The local replay case artifact contains only this accepted synthetic case; tokens and server credentials are excluded. Do not publish the case key or reusable tokens in screenshots/logs.

Record genuine browser receipt and time separately from automated contract/layout tests. Hub must correlate the exact synthetic receipt, source, verified hostname, consent, Admin owner, one enquiry/lead and notification intents. On replay require HTTP 200, the original receipt and unchanged entity/notification counts. Ask the human to confirm exact subject and synthetic name in admin@euranix.com; a sent log alone is insufficient.

Corporate genuine acceptance, assignment and human inbox delivery have passed. See controlled-release-record.json for replay, email-rendering correction and AI statuses. Do not submit extra enquiries or resend accepted notifications to test formatting; coordinate the already-authorised AI enquiry with Hub's correction. Keep existing contact methods and published notice throughout. If intake checks fail, rebuild disabled/email fallback; for broader regression use the saved notice-preserving image.
