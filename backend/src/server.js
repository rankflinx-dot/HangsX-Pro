import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = Number(process.env.PORT || 8080);
const allowedOrigin = process.env.HEDGEX_FRONTEND_ORIGIN;

if (!allowedOrigin) {
  console.error("HEDGEX_FRONTEND_ORIGIN must be configured before startup.");
  process.exit(1);
}

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Permit same-origin/server-to-server requests with no Origin header.
    if (!origin || origin === allowedOrigin) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: false
}));
app.use(express.json({ limit: "16kb", strict: true }));
app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "hedgex-pro-backend" });
});

app.get("/api/v1/platform/status", (_req, res) => {
  res.status(200).json({
    platform: "HedgeX Pro",
    environment: "foundation",
    accountAuthorization: "not_configured",
    botRuntime: "not_configured",
    orderExecution: "disabled",
    demoExecutionEnabled: false
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "not_found" });
});

app.use((err, _req, res, _next) => {
  // Do not serialize request bodies, upstream responses, or secrets into logs.
  console.error("Request rejected:", err?.message || "unknown_error");
  if (res.headersSent) return;
  res.status(400).json({ error: "request_rejected" });
});

app.listen(port, () => {
  console.log(`HedgeX Pro API listening on port ${port}`);
});
