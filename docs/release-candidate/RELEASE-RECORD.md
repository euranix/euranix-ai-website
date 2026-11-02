# euranix.ai — controlled release

AI deployed; 129 public checks and both genuine origin acceptances, assignment and human-confirmed inbox/format checks passed. AI replay remains unverified after browser closure and the Computer Use URL-verification stop; final release validation remains open.

Current deployed candidate: `4dca061b3527b18dc23bcd82ac1150ea3af7eb5a`.

[Complete controlled release evidence](controlled-release-record.json) records exact commits, deployments, receipts, inbox confirmation and rollback archives. Historical test artifacts retain their own timestamps and do not prove live intake. The PR remains unmerged; deployments use pinned candidate commits.

## Live enquiry evidence

| Serving origin | Receipt | Enquiry / lead | Internal notification | Inbox |
| --- | --- | --- | --- | --- |
| www.euranix.com | a4eadbc5-0e8e-4b9b-99aa-e5037e7c3864 | 1 / 1 | #1, mail history 32 | Human-confirmed |
| euranix.ai | 47aea039-ec2b-42f6-bb21-8cd7aef448dd | 3 / 3 | #3, mail history 34; 3 Nov 01:17:43 IST | Human-confirmed; formatting good |
| www.euranix.ai | 0dfbbcb9-14dd-458d-bd36-e54c9f46a646 | 4 / 4 | #4, mail history 35; 3 Nov 01:19:18 IST | Human-confirmed; formatting good |

Each labelled case passed genuine Turnstile with its actual hostname, the published notice version, privacy acknowledgement true and marketing false. Each is assigned to Admin user 1 with no fallback, and the notification recipient is admin@euranix.com only. The shared passive contact is 1. The human's separate submission is excluded from these labelled release cases.

Hub's corrected running commit is `9b892b3996af42ec3ab0eb7b0f4695525e1b4af6`; CI 350 and the production health/configuration checks passed. Its documentation-only main commit `c28f7a01d354f1215d4dfa99797c030a60bb680f` is not the running image. The correction provides HTML and plain-text alternatives, readable labels and omitted empty optional fields; the human confirmed both AI emails display well.

Corporate replay is an explicitly accepted unverified exception. AI replay remains unverified: the apex browsers closed before verification, the www helper also exited before verification with zero requests, and Computer Use then stopped because it could not reliably verify the current native browser URL. No successful retry HTTP response exists. Hub's final read-only audit found unchanged per-case counts: one key/snapshot/label, one lead, two sent intents, one bell and one mail history each. These counts do not establish replay success. Final release validation remains open.

[Current external-destination probes](external-destinations-final.json) still show portal/chat HTTP 503 and system DNS failure for platform.euranix.ai. Email fallbacks remain visible. [Rollback instructions](DEPLOYMENT.md) preserve the published corporate notice and all accepted Hub records.

Genuine browser acceptance screenshots: [AI apex](screenshots/ai-apex-accepted.png), [AI www](screenshots/ai-www-accepted.png). These are separate from deterministic layout screenshots with blocked external scripts.
