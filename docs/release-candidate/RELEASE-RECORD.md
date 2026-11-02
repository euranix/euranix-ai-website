# Enquiry release record — 2 November 2026

This record pins the tested application/evidence commits. The following handoff commit changes documentation only. Neither website main branch was changed and neither public website was deployed.

| Repository | Tested application and evidence commit |
| --- | --- |
| euranix-website | [25b3ab2003403d4adbb2bd307edd9dce909141d2](https://github.com/euranix/euranix-website/commit/25b3ab2003403d4adbb2bd307edd9dce909141d2) |
| euranix-ai-website | [7d380d13084fd9639e5d70dc65ac1e24a4362d86](https://github.com/euranix/euranix-ai-website/commit/7d380d13084fd9639e5d70dc65ac1e24a4362d86) |

This repository's local tested image: **sha256:e49e1e8e93c5f2f5b8f43440c689ef09aa2d1e3a6cd6768fa64d92859499c75b**. It is a local candidate, not a production digest. All public configuration and evidence files are pinned by the source commit above. A later deployable build must record its own immutable image digest and public build values.

Website production baselines: corporate **c4cd685e9026ef825b1bb10a5dfd50fdbfb0eb8d**; AI **75802365f8811093c9043632c860aa5838e5465f**. Existing draft PRs: [corporate #1](https://github.com/euranix/euranix-website/pull/1) and [AI #1](https://github.com/euranix/euranix-ai-website/pull/1). Keep both unmerged.

Hub contract v1: **778e1e1a4319d76efdef00413667925e34390ba1**, docs/website-enquiries-contract.md. Last agent-verified production SHA: **87107dfaf675126f06f4ca8df23519b54850af77**, intake not deployed/accepting at verification. Hub's shared-host candidate began at **27ae15e79677f91a4d8b16ce3152bff1812ca426**; its CRM/retention extension, final SHA and deployment checks are still in progress. These three SHAs serve different purposes; none is asserted as a final accepting deployment.

Final notice version: **website-enquiries-2026-11-02-v1**. Source/provenance, original and canonical hashes, publication patch and verification are in [NOTICE-PUBLICATION.md](NOTICE-PUBLICATION.md). Fresh public probes at 2026-11-02T17:24:25Z found neither the new version nor the anchor on the public privacy page. Portal/chat remained 503 and platform.euranix.ai returned NXDOMAIN.

[Release recommendation](RELEASE-RECOMMENDATION.md): hold public promotion. [Controlled production tests](CONTROLLED-PRODUCTION-TESTS.md): authorised but post-deployment / not run. [Rollback](DEPLOYMENT.md): independent website rollback with the published notice retained and no deletion/replay of Hub records.

Hub coordination update: the user selected **admin@euranix.com (existing user ID 1)** as primary representative and no fallback. Hub confirmed it will not infer Member grants and is preparing the authorised backend deployment. Intake remains disabled pending public notice availability. The exact deployed new SHA has not yet been reported.
