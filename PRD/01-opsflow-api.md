# Opsflow API - Product Requirements Document

**Status:** Ready for implementation  
**Owner:** Backend Engineering  
**Version:** 1.0  
**Target:** MVP, single organization deployment

## Product statement
Opsflow API is the system of record for internal operational requests that require assignment, approval, and an immutable audit trail. It exposes a versioned REST API for a web client and future integrations; it does not include a frontend in this scope.

## Problem, users, and success
Requests currently lose ownership and approval context in chat and spreadsheets. A **requester** submits work, an **operator** executes it, an **approver** accepts or rejects controlled work, and an **admin/auditor** governs access and history.

The MVP succeeds when: 90% of new tasks receive an owner within 10 minutes; 95% of API reads have p95 latency below 100 ms; every state-changing action produces a queryable audit record; and no user can read tasks outside their team.

## Scope
Included: team-scoped tasks, comments, assignment, approval, audit events, search, webhooks, JWT authorization, and OpenAPI documentation. Excluded: task subtasks, file attachments, email UI, billing, SSO setup UI, and cross-organization tenancy.

## Roles and permissions
| Role | Allowed actions |
| --- | --- |
| `requester` | Create tasks for own team; read and comment on accessible tasks |
| `operator` | Requester permissions; assign own work; move assigned tasks through execution states |
| `approver` | Read team tasks; approve/reject tasks assigned to their approval group |
| `admin` | Manage teams, roles, webhook subscriptions, and all team tasks |
| `auditor` | Read tasks and audit events; cannot mutate data |

Every task query and mutation must filter by the authenticated user's `teamIds`; never trust a team ID supplied only by the client.

## Task lifecycle
`draft -> open -> in_progress -> pending_approval -> done` is the normal path. `open` or `in_progress` may become `cancelled`. Only `pending_approval` may become `done` or `rejected`; a rejected task returns to `in_progress`. A task with `requiresApproval=false` may move from `in_progress` directly to `done`. Invalid transitions return `409 INVALID_TRANSITION`.

## Functional requirements
- **OPS-01:** `POST /v1/tasks` accepts `title` (3-140 chars), `description` (max 10,000 chars), `priority` (`low|medium|high|critical`), `teamId`, optional `assigneeId`, `dueAt`, and `requiresApproval`. It creates an `open` task and an audit event.
- **OPS-02:** `GET /v1/tasks` supports `teamId`, `status`, `priority`, `assigneeId`, `createdAfter`, `createdBefore`, `q`, `limit` (1-100), and opaque `cursor`; default sort is newest update first.
- **OPS-03:** `PATCH /v1/tasks/:id` updates only title, description, priority, assignee, and due date. It requires `If-Match` with the current integer `version`; a stale version returns `409 VERSION_CONFLICT`.
- **OPS-04:** `POST /v1/tasks/:id/transitions` accepts `{ "to": "...", "reason": "..." }`; a reason is mandatory for `cancelled` and `rejected`.
- **OPS-05:** `POST /v1/tasks/:id/comments` accepts sanitized plain text up to 4,000 characters and resolves `@user-id` mentions to notification jobs.
- **OPS-06:** `POST /v1/tasks/:id/approvals` accepts `decision` (`approved|rejected`) and `reason`. Only the configured approval group may call it.
- **OPS-07:** `GET /v1/tasks/:id/audit` returns append-only events in chronological order; audit rows are never updated or deleted through the API.
- **OPS-08:** Each mutating endpoint requires an `Idempotency-Key` UUID, retained for 24 hours. Replaying a successful request returns the original status and body.
- **OPS-09:** Admins can create webhook subscriptions with signed deliveries for `task.created`, `task.updated`, `task.approval_requested`, and `task.completed`.

## Data model
Use PostgreSQL UUID primary keys and UTC `timestamptz`. Tables: `users`, `teams`, `team_memberships(user_id, team_id, role)`, `tasks`, `task_comments`, `task_approvals`, `audit_events`, `idempotency_keys`, `webhook_subscriptions`, and `webhook_deliveries`.

`tasks` must include `id`, `team_id`, `title`, `description`, `priority`, `status`, `assignee_id`, `created_by`, `requires_approval`, `due_at`, `version`, `created_at`, and `updated_at`. `audit_events` includes actor, event type, task ID, request ID, before/after JSON snapshots, and timestamp. Use a transactional outbox row whenever an event should trigger a webhook.

## Platform requirements
Authenticate Bearer JWTs using issuer, audience, expiry, and key ID validation. Rate limit login-independent API traffic to 120 requests/minute/user and writes to 30/minute/user. Store rate-limit counters and idempotency data in Redis. Return JSON errors as `{ "error": { "code", "message", "requestId" } }`; never return stack traces. Encrypt transport, redact authorization headers from logs, back up daily, and retain audit records for 12 months.

## Acceptance checks and delivery
Automated tests must prove: cross-team reads return 404; rejected transitions require a reason; replayed idempotency keys create one task; a rejected approval returns the task to `in_progress`; an outbox delivery retries with exponential backoff; and audit rows match every mutation. Deliver schema/auth first, task lifecycle second, comments/approval third, then webhooks, observability, and load/security testing.
