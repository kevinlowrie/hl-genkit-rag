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

See [README.md](README.md) for this project's setup and development commands.
