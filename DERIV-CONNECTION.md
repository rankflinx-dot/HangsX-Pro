# Deriv account connection setup

## Current state

The dashboard has UI for both Login with Deriv and API-token connection. The controls remain disabled until the secure backend is deployed and its public base URL is set in `DERIV_BACKEND_URL` in `index.html`. No OAuth client ID, secret, redirect URI, or deployment credential has been guessed or added. The repository currently has no backend, so account authorization cannot complete yet.

The eight dashboard sections and existing styling are retained. Public market data continues to work without account authorization. The account connection is intended only for account information and market data. Do not enable buy, sell, trade, transfer, or bot execution APIs.

## Deriv app registration still required

Register an OAuth application in the Deriv developer/app management platform. Obtain the real client ID and configure the exact HTTPS callback URL served by the backend. The redirect URI must match the registered value exactly. Configure only the permissions Deriv provides for account information and market data; do not request trading permissions. Follow Deriv's current OAuth requirements for authorization code flow, PKCE (when supported/required), and state validation.

The OAuth client secret, if issued, belongs only in the backend secret manager. Never place it in this repository, GitHub Pages source, browser configuration, or a GitHub Actions artifact. The frontend `DERIV_BACKEND_URL` is a public URL and is not a secret.

## Backend contract required by this frontend

Deploy an HTTPS backend and then set `DERIV_BACKEND_URL` in `index.html` to its public base URL. Implement these endpoints:

- `GET /oauth/deriv/start`: generate and store a one-time `state` and PKCE verifier in a short-lived server-side session, then redirect the browser to Deriv's official consent page. The backend chooses the registered client ID, exact callback URL, and read-only scopes.
- `GET /oauth/deriv/callback`: validate and consume `state`, exchange the authorization code server-side, validate the response, and establish a session. Never return an access token in the redirect URL or page markup. Use a secure, `HttpOnly`, `SameSite=Lax` session cookie (or stricter where compatible), with `Secure` enabled.
- `POST /api/deriv/token/connect`: accept JSON `{ "token": "..." }` over HTTPS, validate the token with Deriv, and return only `{ "connected": true }` on success. Do not echo, persist, or log the submitted token or upstream response containing it. Establish a short-lived server-side session and discard the submitted token after validation. Return generic errors without token details.

The backend must allow CORS only from the deployed HedgeX Pro origin if it is hosted separately. Because this frontend sends the API-token request without cookies (`credentials: omit`), use a CSRF-resistant session establishment design; do not broaden CORS to `*`. Add rate limits, request-size limits, TLS, secret-manager storage, and redacted error logging. On logout/disconnect, revoke credentials when Deriv supports it and invalidate the server session.

## Backend environment configuration

Use the backend platform's secret manager for deployment-specific values. Names below are suggested configuration keys, not populated credentials:

```text
DERIV_OAUTH_CLIENT_ID=<registered client ID>
DERIV_OAUTH_CLIENT_SECRET=<server-side secret, only if Deriv issues one>
DERIV_OAUTH_REDIRECT_URI=<exact registered HTTPS callback URL>
DERIV_OAUTH_SCOPES=<only read-only account and market-data scopes supported by Deriv>
SESSION_SECRET=<random server-side session signing/encryption secret>
HEDGEX_FRONTEND_ORIGIN=<exact deployed frontend origin>
```

Do not copy these placeholder values literally. Confirm current parameter names, authorization/token endpoints, and supported scopes against Deriv's official documentation during backend implementation. Never enable an execution scope.

## Frontend configuration

After deploying and securing the backend, set the public HTTPS base URL in `DERIV_BACKEND_URL` near the start of the inline script in `index.html`. This configures routing only; it must contain no secret. If the backend is unavailable or unset, both account connection methods remain disabled. The token input is cleared immediately on submit and again when the request finishes. No account token or OAuth credential is stored in `localStorage` or `sessionStorage` or written to the dashboard activity log.

## Trading remains disabled

The connection UI grants no order-entry functionality. Preserve disabled buy/sell controls, keep all contract execution routes absent, and do not add trading permissions when completing the backend. The existing local storage used for paper strategy settings is unrelated to account credentials.
