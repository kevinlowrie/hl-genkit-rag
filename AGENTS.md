# Repository Guidelines

## Contributor workflow

Use a lightweight 3-amigos workflow: an accountable owner defines the outcome,
a coder implements a small, well-scoped change, and an independent reviewer
checks the result. Keep each implementation handoff small and self-contained.
If independent review is unavailable, say so rather than treating self-review
as equivalent.

Follow RED -> GREEN -> CLEAN: reproduce the problem, add or update the relevant
check, make the change, and rerun checks after cleanup. For documentation-only
changes, verify content and links and explain why runtime tests do not apply.

Keep shared working notes non-secret. Use an approved Redis service for
temporary coordination state; Git and pull requests remain the durable record.
If it is unavailable, agree on an appropriate work item and a single writer for
each slice; resolve existing ownership before changing coordination methods.
Never publish private operational details, credentials, personal data,
or customer data in this public repository or its issues and pull requests.

Use small feature PRs. Stack dependent changes within a repository and record
cross-repository dependencies and merge order without exposing private details.
Open draft PRs with checks for the exact head and independent review. Record
failed, blocked, and not-run checks honestly. Complete authorized work through
reviewed, checked merges to `main`, verify the remote result, and leave the
task-owned worktree clean without disturbing other work. Missing authorization,
checks, or review is a blocker, not permission to bypass a gate or deploy.

## Cross-repository sprint delivery

- **Plan before coding:** decompose each feature, extension, or new application
  into coordinated cross-repository sprints before implementation. Name one
  accountable feature owner and each repository slice's owner, contract,
  dependencies, acceptance gates, and documentation impact. Maintain one feature
  plan tracing user outcome -> sprints -> repository slices -> stacked PRs ->
  integrated result and acceptance. Reuse existing plans and work identities.
- **Paired implementation:** one overall owner on a capable frontier model
  retains the full feature scope, integration, and approval boundaries. A
  noncoding, domain-specific operator (engineering, design, video, or audio as
  appropriate) translates user scenarios and acceptance examples into direction
  for smaller-model coder pairs. Give each operator and coder bounded,
  self-contained, single-prompt task packets: outcome, owned paths, contracts,
  dependencies, checks, and stopping point. Use paired coder tooling only where
  available and approved, without assuming any provider, installation, or
  capability. Iterate RED -> GREEN -> CLEAN -> QA/independent review -> validation
  handbacks without weakening acceptance tests to obtain green. The operator
  directs rather than implements, checks work in only when authorized, and hands
  exact delivery and test evidence to the full-scope feature owner. The owner
  verifies alignment with the original scope and direction, resolves any drift,
  and retains each PR through authorized completion. The owner approves and
  claims a dependent next sprint only after its prerequisite gates pass;
  independently ready sprints and PR units may proceed concurrently, with final
  assembled milestone acceptance still required. This workflow approval never
  replaces required human or security approvals. Bound parallel operators and coder pairs by cost,
  available capacity, isolated ownership, and available approved tooling; any
  example topology is illustrative, not a fixed worker count. The operator does
  not replace independent review, and smaller contexts do not transfer the
  owner's outcome responsibility.
- **Sprint milestones:** use one canonical sprint milestone in the authorized
  coordinating repository, linked in both directions to the matching
  repository-local sprint milestone or work item for each participating slice.
  GitHub milestones belong to one repository and do not span repositories.
  Reuse existing milestones and stable work-item identities; create missing
  records only when authorized. Trace each slice's PRs and acceptance evidence
  to the feature plan. For private coordination, keep the bidirectional mapping
  in authorized private records and use sanitized public work items here; do
  not publish private repository URLs, project IDs, or operational details.
- **PR stacks:** link each PR to its repository sprint and feature-plan slice.
  Record its repository, exact head, actual base, dependencies, and final `main`
  target (or verified shared target). Within one repository, a dependent PR bases
  on its parent branch; independent PRs may base directly on `main`. Across
  repositories, use dependency links, pinned contract/commit/artifact versions,
  seam checks, and merge order, never pretend a dependency is a Git parent.
  When a parent moves or merges, rebase/retarget dependent PRs as appropriate,
  inspect the resulting diffs, and rerun affected checks and current-head review.
- **Safe parallelism:** map the sprint as a dependency graph of independently
  checkable, PR-sized units. Maximize concurrent nonconflicting work in isolated
  worktrees with declared file and contract ownership, shared-resource locks or
  claims, and a latest base/head check before writes. Reconcile changed heads or
  ownership before proceeding; separate worktrees alone do not prevent conflicts.
  Serialize dependent integration and shared-resource mutations while independent
  units continue. The owner verifies scope and the end-to-end milestone outcome,
  not merely worker completion; retain existing coordination and lease boundaries.
- **Concurrent domain teams:** agree on the shared user scenario and versioned
  contracts first, then run nonconflicting domain teams concurrently rather than
  imposing a producer-first waterfall. For example, an infrastructure/SRE backend
  operator and domain owner direct paired coders; middle-management and client-
  delivery domain owners direct Python, Go, or Node work as relevant; a UX owner
  directs the interface team. These roles remain under the full-scope feature
  owner, with explicit dependencies and file ownership. Scaffolds and RED tests
  may proceed concurrently against declared contracts. Reconcile interfaces
  bidirectionally as findings arrive, then exercise the integrated user scenario
  as real implementations become available. Mark mocks and scaffolds integration
  pending; only real end-to-end acceptance evidence closes the milestone.
- **Visible status and evidence:** reuse the existing board and canonical cards,
  matching repository plus PR/issue number or verified URL, not titles alone.
  Read the live field schema and option IDs; use the existing
  To Do / In Progress / Done workflow with its verified option spelling,
  without inventing fields or status options.
  Move actively claimed implementation to `In Progress`; read-only inspection
  alone is not a claim. The agent performing each delivery event reconciles its
  item after verification, rereads the result, and preserves newer owner edits.
  Serialize shared-item writes through the owner. Record exact commit, verified
  remote push, merge base/result, deployment artifact/environment, and acceptance
  evidence separately from board status, with source links and observation times.
  A parent-branch merge is not final-target integration; a push is not a merge,
  and a merge is not deployment or acceptance. On failed or uncertain updates,
  retain delivery facts and report the pending reconciliation instead of success.
- **Sprint gates:** keep component endpoints distinct from the feature rollup.
  Do not mark a sprint or feature `Done` until every required repository slice,
  dependency, final-target integration, acceptance gate, and closeout deliverable
  is verified. Test the compatible commit/artifact set together; local fixtures
  or one merged PR do not prove assembled acceptance. Record blocked, not-run,
  and out-of-scope gates explicitly, with the next action and responsible owner.
- **Owner check-ins and closeout:** at each delivery check-in, the feature owner
  writes one sentence stating the tangible outcome and remaining delivery boundary
  in the established authorized progress destination. Coders hand off concise
  documentation-impact notes covering changed behavior, setup, dependencies,
  compatibility, limitations, and evidence; they do not rewrite READMEs at every
  check-in. At sprint end, the owner consolidates the relevant READMEs once from
  accepted evidence, preserving useful guidance and distinguishing planned,
  merged, deployed, and accepted behavior. Review, check, and verify the shared
  README revision before claiming documentation closeout.
- **Existing gates still apply:** retain 3-amigos, RED -> GREEN -> CLEAN,
  independent review, current-head checks, and all repository-specific boundaries.
  Planning or board updates grant no permission to publish, merge, deploy,
  connect to systems, change access, or bypass required approval. Use the agreed
  coordination record with one writer per slice; never claim a live coordination
  service or runtime was verified merely because documentation changed.

See [README.md](README.md) for this project's setup and development commands.
