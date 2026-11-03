# HangsX-Pro
HangsX Pro - Deriv trading dashboard

## Deriv account connection

The dashboard offers two read-only connection choices: Login with Deriv (OAuth) and a user-entered Deriv API token. Both require a separately deployed HTTPS backend; the GitHub Pages frontend intentionally keeps the controls disabled until `DERIV_BACKEND_URL` in `index.html` is configured. See [Deriv account connection setup](DERIV-CONNECTION.md) for app registration, backend routes, and environment requirements.

No OAuth client ID, secret, callback URL, or deployment credential is included in this repository. Never add credentials or user tokens to frontend source. The UI does not persist tokens, and trade/order execution remains disabled.
