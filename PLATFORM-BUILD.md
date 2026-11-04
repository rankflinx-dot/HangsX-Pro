# HedgeX Pro platform build plan

The selected product direction is **in-site bot operation**: users will manage bots and monitor them inside HedgeX Pro after securely authorizing their own Deriv accounts.

## Existing frontend

The current GitHub Pages site already provides public Deriv market data, a chart, market statistics, a local bot-file list, and preview-only manual-trading screens. Imported files are not executed. GitHub Pages cannot host user accounts, a persistent bot worker, or a secure broker integration.

## Build sequence

### Stage 1 — server foundation
- Create a separately hosted Node.js API.
- Establish strict origin controls, security headers, request limits, and health/status endpoints.
- Keep account authorization and order execution disabled until configured.

### Stage 2 — user accounts
- Registration and login, verified email, password reset, secure server-side sessions, user profiles, and database-backed bot records.
- Add account deletion and session revocation.

### Stage 3 — Deriv authorization
- Use Deriv's official OAuth flow and the currently supported scopes.
- Store broker credentials only server-side, encrypted and access-controlled.
- Start with demo-account authorization and verify account type on the server.

### Stage 4 — bot workspace and demo runtime
- Define a versioned, validated strategy format.
- Add create/configure/save/duplicate/pause/stop flows.
- Run strategies in isolated workers, never by evaluating uploaded code in the web page or API process.
- Start with demo-only order routing, per-user isolation, resource limits, audit logs, and user-defined loss/stake limits.

### Stage 5 — operations and review
- Add bot run history, performance reporting, alerts, reconnect handling, and admin support tools.
- Perform security review, failure testing, and broker-policy checks before any live account capability is considered.

## Non-negotiable safeguards

- No guaranteed-profit claims.
- No broker passwords or API tokens in frontend source, localStorage, sessionStorage, analytics, or logs.
- No live order placement in the current foundation.
- Never execute arbitrary uploaded JavaScript.
- Bot execution must have a server-side stop control and clear user-visible status.
- Demo and live account modes must never be confused.

## Deployment decision still needed

The frontend remains on GitHub Pages. The backend must be deployed separately to a Node.js-capable HTTPS host. The owner must choose the host and provide/configure the public API origin before account login or bot workers can be connected.
