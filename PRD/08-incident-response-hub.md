# Incident Response Hub - Product Requirements Document

**Status:** Ready for implementation  
**Owner:** Product and Platform Engineering  
**Version:** 1.0  
**Target:** Internal incident coordination workspace

## Product statement
Incident Response Hub is a structured workspace for creating, coordinating, updating, resolving, and learning from service incidents. It replaces the Portfolio CMS concept with a portfolio project that demonstrates real backend, reliability, integration, and cloud-operation concerns.

## Problem, users, and goals
During an outage, ownership and decisions fragment across chat threads. A **reporter** raises an incident, an **incident commander** coordinates it, **responders** mitigate it, **stakeholders** consume updates, and **admins** manage service/on-call policy. The MVP target is incident creation below two minutes, commander assignment below five minutes, and a durable timestamped record of every material decision.

## Scope
Include manual and alert-webhook incident creation, severity, service ownership, on-call escalation, immutable timeline, incident tasks, subscriber updates, internal status view, postmortems, and exports. Exclude external public status pages, video/chat replacement, automated remediation, and full PagerDuty replacement.

## Lifecycle and authority
Lifecycle: `detected -> triaged -> investigating -> mitigating -> monitoring -> resolved -> postmortem_due -> closed`. Severity is `S1` through `S4`; S1/S2 require a commander and a scheduled next update. Only a commander or admin may change severity, resolve an incident, or assign roles. No incident is hard-deleted.

## Functional requirements
- **INC-01:** `POST /api/incidents` accepts service, severity, customer impact, summary, detected time, and source. It creates a `detected` incident, assigns an incident ID, and appends a creation event.
- **INC-02:** `POST /api/webhooks/alerts` verifies a provider signature and deduplicates alert events using provider alert ID plus service. A matching active incident receives a timeline event instead of a duplicate incident.
- **INC-03:** The service resolves the primary on-call for the affected service and creates an escalation timer. If S1/S2 remains unacknowledged for five minutes, it escalates to the team lead.
- **INC-04:** `POST /api/incidents/:id/roles` assigns `commander`, `communications`, or `responder`. One active commander is required before transition from `triaged` to `investigating`.
- **INC-05:** `POST /api/incidents/:id/events` appends typed events: `status_update`, `note`, `decision`, `mitigation`, `deployment`, `link`, `role_change`, and `alert`. Events contain actor, timestamp, markdown body, and optional external URL.
- **INC-06:** The commander creates tasks with owner, due time, status, and a link to the relevant timeline event. Completed tasks stay visible after resolution.
- **INC-07:** S1/S2 incidents display an overdue-update marker when the configured next-update time passes. Subscribers receive status updates and cannot see services outside their permitted teams.
- **INC-08:** The internal status view displays affected services, impact, current phase, latest approved update, and next-update estimate, but hides restricted timeline events.
- **INC-09:** Resolution requires impact summary, resolution time, and a final status update. It automatically sets a postmortem due date five business days later for S1/S2.
- **INC-10:** Postmortems capture impact, customer duration, timeline, root cause, contributing factors, what went well, and action items. Action items require an owner and due date; overdue items trigger reminders.

## Data model and integration design
PostgreSQL tables: `services`, `teams`, `on_call_schedules`, `incidents`, `incident_roles`, `timeline_events`, `incident_tasks`, `subscribers`, `notification_deliveries`, `postmortems`, `postmortem_actions`, and `audit_events`. Redis handles idempotency locks, delayed escalations, and notification fan-out. Object storage holds attachments. All event timestamps are UTC; timeline rows are append-only. Integrations use signed webhooks and queued, retryable Slack/email delivery.

## Non-functional requirements
Enforce team-scoped RBAC, encrypted integration secrets, idempotency keys for writes, optimistic concurrency for incident updates, request correlation IDs, audit retention of 24 months, p95 incident create below 500 ms, p95 read below 300 ms, and notification enqueue below five seconds. Follow WCAG 2.2 AA for status, keyboard access, and color-independent severity labels.

## Acceptance, metrics, and delivery
Tests must prove duplicate alerts do not duplicate incidents, only authorized users change severity, timeline actor/time is immutable, unacknowledged S1 escalates, recovery cannot silently close an incident without a final update, restricted events stay hidden, and postmortem reminders fire for overdue actions. Measure MTTD, MTTA, MTTR, update-SLA compliance, escalation success, repeat-incident rate, and postmortem completion.

Deliver incident/service schema and auth first, then lifecycle/timeline/roles, then webhook and notification escalation, then status view/postmortems/tabletop exercise and reliability tests.

## Stitch Prompt
 Incident Response Hub

  Design a responsive internal incident-management application named Incident Response Hub. It supports service incidents from detection
  through postmortem. This is a serious operational workspace, not a public status-page landing site.

  Create: incident list, incident command workspace, internal status view, service/on-call configuration, postmortem editor, and action-
  item tracker.

  The incident command workspace is the primary screen. It must show incident ID, severity S1-S4, affected services, lifecycle stage,
  incident commander, responders, customer impact, next update deadline, and a chronological timeline. The timeline supports status
  updates, decisions, mitigations, deployments, linked alerts, and role changes. Include an action-task rail with owners and due dates.
  Show overdue update states prominently but calmly. Resolution must require a final summary, and postmortems must capture impact, root
  cause, contributing factors, and follow-up actions.

  Use a dense, composed enterprise operations design: neutral surfaces, high contrast, semantic severity colors, compact controls,
  timestamps, and clear ownership markers. The incident workspace should feel focused under pressure. Use no gradients, no decorative
  illustrations, no excessive rounded cards, and no marketing layout. Include mobile views focused on the current incident, latest update,
  and assigned tasks.