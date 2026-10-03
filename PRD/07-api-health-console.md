# API Health Console - Product Requirements Document

**Status:** Ready for implementation  
**Owner:** SRE/Platform Engineering  
**Version:** 1.0  
**Target:** HTTP synthetic monitoring for up to ten services

## Product statement
API Health Console schedules HTTP(S) synthetic checks, stores health history, detects incidents, and sends actionable alerts for a small service portfolio. It provides availability insight, not full APM, browser testing, or multi-region monitoring.

## Goals
Users should see each service's current state in one screen, distinguish service failure from checker failure, and receive a deduplicated alert within one check interval. Default checks run every five minutes. Raw check records are retained 30 days and daily aggregates 13 months.

## Functional requirements
- **HEA-01:** Admins create services with `name`, HTTPS URL, method, encrypted request headers, optional body, expected status range, optional JSON-path assertion, timeout (1-30 seconds), interval (1-60 minutes), owner team, and enabled flag.
- **HEA-02:** Workers add deterministic schedule jitter and enforce per-host concurrency limits. A check stores scheduled/started/finished time, duration, status code, assertion result, error category, and truncated redacted response sample.
- **HEA-03:** Error categories are `dns`, `connect`, `timeout`, `tls`, `http_4xx`, `http_5xx`, `assertion`, and `checker_error`. `checker_error` results in service state `unknown`, not `down`.
- **HEA-04:** A service becomes `degraded` after one failed check and `down` after three consecutive confirmed failures. A confirmation check runs from a second worker before opening an incident.
- **HEA-05:** `GET /api/services` returns current state, last check, 24h uptime, p50/p95 latency, and open incident. `GET /api/services/:id/history` returns buckets and individual checks by time range.
- **HEA-06:** Incident states are `detected`, `acknowledged`, `investigating`, and `resolved`. `POST /api/incidents/:id/ack` records actor and timestamp; a recovered service resolves its open incident automatically with a recovery event.
- **HEA-07:** Alert rules support email, Slack, and outbound webhook. Send one alert per incident, escalate unacknowledged incidents after configurable delay, and send one recovery notice.
- **HEA-08:** Maintenance windows suppress state alerts but retain check history, visibly label the service, and cannot be backdated by non-admins.

## Data and security
Use PostgreSQL tables `services`, `check_runs`, `check_aggregates`, `incidents`, `incident_events`, `maintenance_windows`, `alert_rules`, `alert_deliveries`, and `audit_events`. A Go scheduler/worker claims checks with transactional locks. Encrypt sensitive headers, redact values in logs/storage, restrict URLs to private-network-safe targets to prevent SSRF, and use RBAC for configuration and incident actions.

## Acceptance and rollout
Acceptance tests must distinguish timeout/4xx/5xx/DNS fixtures, avoid opening an incident during maintenance, deduplicate repeated failures, resolve after confirmed recovery, alert once per incident, and mark failed scheduler execution as `unknown`. Targets: dispatch p95 below one second, result visible within 60 seconds, console availability 99.9%. Deliver service/check engine, history/dashboard, incident/notification workflow, then security/load testing.

## Stitch Prompt
  API Health Console

  Design a responsive HTTP synthetic-monitoring application named API Health Console. It monitors up to ten services and helps SREs
  understand uptime, latency, failing checks, incidents, and alert delivery.

  Create: service overview dashboard, service detail with health history, create/edit service form, incident list and detail, maintenance-
  window editor, and alert-rule settings.

  The main dashboard must show current state for every service, 24-hour uptime, p95 latency, latest check, open incident, and a compact
  history bar. Service detail must show latency and uptime charts, check history, response-code distribution, categorized failures (DNS,
  timeout, TLS, 4xx, 5xx, assertion failure), and maintenance labels. Incident detail must include timeline, acknowledgement, current
  owner, and recovery event.

  Use a focused SRE console aesthetic: light neutral background, dark text, semantic green/amber/red/gray statuses, dense information
  layout, compact charts, and clear time-range controls. Use 8px-radius panels and Lucide-style icons. Do not use gradients, decorative
  illustrations, marketing copy, or large hero text. Include clear loading, no-data, unknown-checker-state, and alert-delivery-failed
  states.