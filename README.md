# HangsX-Pro
HedgeX Pro — Deriv trading workspace.

## Current website features
- Public Deriv market-data feed, symbol discovery, tick chart, and descriptive market statistics.
- In-site Bot Builder for creating and saving native signal-monitor configurations.
- Signal-only paper monitoring using public market ticks, with start, pause/resume, stop, and a local signal journal.
- Local bot-file selection for XML, JSON, JavaScript, and text files. Imported files are not executed or uploaded.
- Preview-only manual trading UI. No order placement is implemented.

## Paper monitor limitations
The paper monitor evaluates price movement across a configurable tick window and records UP/DOWN signals. Signals are descriptive events, not predictions or trading recommendations. The monitor does not open contracts, calculate payouts or profit/loss, or send orders. Strategy configurations are stored in the browser's local storage and are not synced to a user account.

## Backend
The Node.js API starter is in `backend/`. GitHub Pages cannot run the API, database, or persistent bot workers; deploy the backend separately to an HTTPS-capable Node.js host. The current backend only exposes health and platform-status endpoints. It does not provide login, Deriv authorization, bot execution, or order placement.

See:
- [Backend setup](backend/README.md)
- [Platform build plan](PLATFORM-BUILD.md)
- [Deriv account connection setup](DERIV-CONNECTION.md)

No credentials or secrets belong in frontend source or GitHub commits. Real-money trading is not available in this project stage.
