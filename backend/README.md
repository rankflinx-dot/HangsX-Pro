# HedgeX Pro backend foundation

This is the first server-side foundation for the in-site platform option. The existing public website is hosted on GitHub Pages, which serves static files; it cannot host a persistent API or bot runtime. This Node.js service is intended for a separate HTTPS host.

## Included in this stage

- Express API service using Node.js 22+
- Helmet security headers
- Exact-origin CORS allowlist
- JSON body size limit
- Global request rate limit
- Health endpoint: `GET /health`
- Honest capability endpoint: `GET /api/v1/platform/status`

The status endpoint deliberately reports account authorization, bot runtime, and order execution as not configured/disabled. No trading orders are accepted or sent.

## Run locally

Run the automated API smoke tests with `npm test` before starting the service. The tests cover the health endpoint, security headers, the exact-origin CORS allowlist, honest capability reporting, and the absence of an unfinished token-connect route.


1. Install Node.js 22 or later.
2. Copy `.env.example` to `.env`.
3. Set `HEDGEX_FRONTEND_ORIGIN` to the exact browser origin of the deployed site (for example, `https://rankflinx-dot.github.io`).
4. Run `npm install`, then `npm start`.
5. Check `http://localhost:8080/health` and `/api/v1/platform/status`.

Do not deploy over plain HTTP. Configure the host's HTTPS termination and environment variables in its secret/configuration settings. Do not commit real credentials or user tokens.

## Next implementation gates

1. Select and configure a backend host and production API origin.
2. Add account registration, login, verified email, secure sessions, password reset, and a database.
3. Implement Deriv OAuth using the current official Deriv authorization requirements. Keep OAuth secrets server-side; never store broker tokens in browser storage or log them.
4. Build a bot registry and strategy configuration format. Treat imported files as untrusted data; do not evaluate uploaded JavaScript in the API process.
5. Add a sandboxed demo-only worker with per-user isolation, resource limits, audit events, and a reliable stop mechanism.
6. Test on Deriv demo accounts and add explicit user risk limits before considering any live-trading capability.

## Safety boundary

This starter has no Deriv trade API integration, no token connection endpoint, no bot execution endpoint, and no order-placement code. Do not switch on real-money trading by changing a frontend flag. Any future demo runtime must be implemented and reviewed server-side, with broker authorization, per-user controls, loss limits, and operational monitoring.
