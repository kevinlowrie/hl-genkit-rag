# Threat model: Firebase Genkit itinerary codelab

Reviewed: 2026-11-10. Source baseline: `f3d31424d354fddf2cce2612bce5108e1cc5784d`.
Status: public source-only review; a codelab, not a production security assessment.

## Scope, assets and actors

Scope is the Next.js itinerary app, Genkit flow, Firestore access and local data loader in [README](../README.md). Protect user requests/images, model quota/spend, dataset integrity, credentials and traces. Actors are browser users, abusive anonymous callers, dataset maintainers, operators and compromised dependencies. No deployment, credentials or external application context was inspected or assumed.

## Flows and trust boundaries

1. Browser form → server action [itinerary.ts](../src/lib/itinerary.ts) → full-file base64 conversion → Genkit flow. Uploaded files and request text are untrusted.
2. [itineraryFlow.ts](../src/lib/genkit/itineraryFlow.ts) passes request and retrieved metadata to a prompt/model and returns output to the UI. [Schemas](../src/lib/genkit/types.ts) constrain shape, not truth or authorization.
3. [placesRetriever.ts](../src/lib/genkit/placesRetriever.ts) currently returns a `TODO` document. The real vector retriever is commented out, as is image-description generation in the flow. The activities helper uses Firebase Admin SDK. The intended complete RAG/image path is not implemented.
4. [genkit.config.ts](../src/lib/genkit/genkit.config.ts) enables Firebase telemetry and configures Vertex AI with a placeholder project. Runtime credentials, model processing and telemetry cross service boundaries. Admin SDK access is governed by IAM, not client Firestore rules.
5. [Firestore rules](../firestore.rules) allow public activities/places reads and public creates in two trace collections. Data loading is a privileged operator action, not a safe fixture test.

## Prioritized threats

P1: address before public deployment. P2: harden before real data or scale. Owners are recommended roles.

| Priority / attack | Observed control | Residual gap | Owner / mitigation | Verification |
| --- | --- | --- | --- | --- |
| P1: anonymous model-cost exhaustion | Missing request rejected; schemas; current TODO retriever returns one document | No authentication, caller rate limit or budget check in reviewed action; retrieval limit 3 is configured for the intended retriever, and multi-itinerary cost amplification becomes relevant when it returns multiple documents | App owner: authenticate, quota and bound input/concurrency | Mocked-provider tests for anonymous, repeated and over-quota requests |
| P1: trace spam or unintended dataset disclosure | Rules restrict named collections, not general writes | Public trace creates and public dataset reads are intentional tutorial permissions | Firebase owner: replace rules before storing nonpublic data; bind writes to service identity | Add emulator-only rules tests denying anonymous trace writes and unauthorized reads |
| P1: upload memory exhaustion | Browser selection limit 3; server excludes empty files | Action does not enforce count/byte/MIME limits before reading files; browser limits bypassable | App owner: server limits before allocation and body limits | Synthetic files and oversized metadata; reject before arrayBuffer/provider call |
| P2: prompt injection from request or dataset | Structured output; no tool execution in reviewed flow | Schema does not prevent poisoned recommendations or output URLs | RAG owner: separate instructions/data, curate dataset, validate references/URLs | Mock hostile text/metadata; verify allowed output references and URL schemes |
| P2: private request/image disclosure in traces | Telemetry explicitly enabled; image path currently disabled | Capture, access and retention not established; commented image logging increases exposure if enabled | Operator: redact/minimize telemetry, choose access/retention policy, disclose provider processing | Fake trace exporter with synthetic private strings; verify no payload leakage |
| P2: excessive credential privileges or compromised package | Server-side Admin SDK and lockfiles | IAM scope, credential protection and dependency advisories not proven | Operator/maintainer: least-privilege runtime identity, external secret storage, dependency review | Offline manifest review; separately authorized IAM/advisory checks |

## Assumptions and unknowns

Only this repository's public tracked source informs this model. The package's `private` flag prevents npm publication, not application access. Hosting exposure, IAM, deployed rules, framework body limits and telemetry contents are unverified. Model output is untrusted advice. Enabling either TODO changes this model substantially.

## Safe verification

Read-only checks, with no Genkit import, credentials or provider calls:

```sh
node -e "JSON.parse(require('fs').readFileSync('package.json')); JSON.parse(require('fs').readFileSync('firestore.indexes.json')); console.log('JSON valid')"
git diff --check
```

There is no test script in [package.json](../package.json). Mock/rules tests above are proposed gaps, not completed checks. Do not run dev/start/build, data loading, deployment or provider flows for this review. A production gate must separately test auth, rules, upload limits and telemetry with fixtures.

## Maintenance triggers

Revisit on real retriever/image activation, prompt/schema changes, added tools, rules/IAM changes, public hosting, telemetry changes or Next.js/Genkit upgrades.
