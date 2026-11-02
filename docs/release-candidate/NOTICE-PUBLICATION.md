# Enquiry notice publication — prepared, not deployed

Approved identifier: **website-enquiries-2026-11-02-v1**. Public destination: **https://www.euranix.com/privacy#website-enquiries**. The final text was supplied by the existing Hub agent on 2 November 2026 after the user's approval decisions. Hub's source is **docs/privacy/website-enquiries-2026-11-02-v1.md**, in its enquiry-production worktree. The Hub agent's final commit/deployment status remains a separate release dependency; the original contract commit must not be presented as the notice's source commit.

Original supplied CRLF file SHA-256: **9E27323780666CDA123E7A0E445E241445163DA5EF9E3636A047AB8656E971F6**. Canonical LF text SHA-256: **315ecd49f1c278a7a894a122b18f8259ec084c5ded7af2a1b8dccb97f15ff0c9**. Git can normalise line endings; the wording, paragraph boundaries, links, version and date are unchanged. The canonical hash supports verification on either platform.

The corporate candidate imports the approved Markdown into a separate accessible section at the required anchor. It preserves the entire existing general policy and its original date. Browser assertions compare the rendered notice with the supplied source. Desktop/mobile direct-anchor checks confirm visibility and no horizontal overflow; see notice-tests.json in the corporate repository. Required privacy acknowledgement and optional marketing start unchecked in both forms; both notice links open this exact public URL in a new tab and preserve entered values.

## Minimal publication artifact

The corporate repository contains **privacy-publication.patch**, prepared against main at **c4cd685e9026ef825b1bb10a5dfd50fdbfb0eb8d**. It contains only the approved notice source, its small rendering component and the import/mount in the existing Privacy page. A temporary Git index verified that it applies cleanly to that baseline. It does not include the redesign or enable intake. It has not been applied to main or deployed.

After publication approval, the release operator should apply/review this patch on the actual current production source, run that site's normal build and policy/anchor checks, and publish through the existing site resource. Revalidate if main has moved. This narrow patch has an apply check, not an independently executed deployment or full baseline-build test. Alternatively the full approved candidate can publish the same section while intake remains off.

Public notice verification is a gate for Hub enablement. A local screenshot, branch file or candidate build is not sufficient. Read the public page after publication, compare the exact version/text, and tell the Hub agent the verified publication time and commit. Do not enable forms before Hub confirms its accepting deployment and assignment/notification configuration.

## Rollback constraint

Keep the published notice available while either website or Hub can accept enquiries that acknowledge it, and while it is needed for records already collected. A site rollback to an image predating this notice must not silently remove it. Prefer a known-good image with the supplement retained; if necessary coordinate disabling intake on both sites and Hub before any rollback that removes the notice, and preserve the notice through a separately reviewed publication. Do not delete accepted Hub records or resubmit them during rollback.

Corporate candidate artifacts: [notice source](https://github.com/euranix/euranix-website/blob/codex/flagship-design-review/src/content/website-enquiries-2026-11-02-v1.md), [minimal publication patch](https://github.com/euranix/euranix-website/blob/codex/flagship-design-review/docs/release-candidate/privacy-publication.patch). Exact candidate commits are recorded in RELEASE-RECORD.md.
