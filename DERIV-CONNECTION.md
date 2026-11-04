# Deriv account connection setup

## Current state

HedgeX Pro currently uses Deriv's public market-data WebSocket without account authentication. The dashboard contains disabled account-connection controls, but no account authorization backend has been deployed. No Deriv app ID, OAuth client ID, client secret, callback URL, or user token is stored in this repository.

The Node.js starter under `backend/` is only a health/status API. It deliberately has no OAuth, token-ingestion, account-session, bot-worker, or order-placement endpoints.

## Official Deriv authentication flow

For a browser-based platform, Deriv currently documents OAuth 2.0 Authorization Code with PKCE. The documented authorization endpoint is `https://auth.deriv.com/oauth2/auth` and the token endpoint is `https://auth.deriv.com/oauth2/token`. The registered redirect URI must match exactly. Generate a fresh cryptographically random `state` and PKCE verifier for each attempt, verify and consume state on callback, and exchange the authorization code server-side. Do not expose authorization codes or access tokens in frontend code, URLs, logs, or analytics.

Deriv documents OAuth scopes including `trade`, `account_manage`, `application_read`, and `payment`. These are not a generic read-only account scope. Do not assume that a read-only trading-account permission exists or request `trade` merely to make login work. Before implementing account access, verify the exact current endpoint permissions and minimum scope required for each feature in the official Deriv API documentation. Keep any feature requiring trading permission unavailable until a separate demo-only execution phase is designed and reviewed.

Deriv OAuth access tokens expire according to the returned `expires_in` value; the current guide says third-party apps do not receive refresh tokens. Reauthorize when required rather than assuming a refresh-token flow.

Official references:
- Authentication overview: https://developers.deriv.com/docs/intro/authentication/
- OAuth 2.0 and PKCE: https://developers.deriv.com/docs/intro/oauth/
- API workflows: https://developers.deriv.com/docs/workflows/

## Backend deployment

GitHub Pages serves static files only. It cannot host the persistent API, database, user sessions, or isolated bot workers required for the in-site platform. Deploy the Node.js service in `backend/` to a separate HTTPS-capable host.

Configure the exact public frontend origin using `HEDGEX_FRONTEND_ORIGIN`. Set `PORT` as required by the host. Do not add secrets to GitHub source or frontend JavaScript. The frontend API base URL, once configured, is public routing information and is not a secret.

## Next implementation gates

1. Choose a Node.js-capable HTTPS host and provide the backend's public origin.
2. Add database-backed user accounts, verified email, password reset, secure server-side sessions, logout, and session revocation.
3. Register a Deriv OAuth application and its exact HTTPS callback URL.
4. Implement OAuth Authorization Code + PKCE on the backend after verifying current Deriv endpoint requirements and least-privilege scopes. Encrypt tokens at rest, restrict access, never log them, and handle expiry/re-authorization.
5. Design a validated, versioned bot strategy format. Treat uploaded files as untrusted; do not execute arbitrary uploaded JavaScript in the API process or browser.
6. Add isolated demo-only workers, per-user resource limits, audit events, user-set risk limits, and a reliable stop control. Keep live trading unavailable.

## Security boundary

The current foundation accepts no Deriv credentials and sends no orders. Do not enable trading by changing a frontend flag. Never request payment or account-management permissions for bot operation. Any future order execution requires a separately reviewed authorization model, explicit user consent, demo testing, operational monitoring, and risk controls.
