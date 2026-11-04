import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";

const allowedOrigin = "https://hedgex.example";
let child;
let baseUrl;

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => server.listen(0, "127.0.0.1", resolve).once("error", reject));
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return port;
}

before(async () => {
  const port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, ["src/server.js"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: String(port), HEDGEX_FRONTEND_ORIGIN: allowedOrigin },
    stdio: ["ignore", "pipe", "pipe"]
  });

  await new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error("Backend did not start in time: " + output)), 5000);
    child.stdout.on("data", chunk => {
      output += chunk.toString();
      if (output.includes("HedgeX Pro API listening")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    child.once("error", error => { clearTimeout(timeout); reject(error); });
    child.once("exit", code => { clearTimeout(timeout); reject(new Error("Backend exited before startup: " + code)); });
  });
});

after(() => {
  if (child && child.exitCode === null) child.kill("SIGTERM");
});

test("health endpoint responds and includes security headers", async () => {
  const response = await fetch(baseUrl + "/health");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: "hedgex-pro-backend" });
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("platform status does not advertise unfinished account or trading features", async () => {
  const response = await fetch(baseUrl + "/api/v1/platform/status", {
    headers: { Origin: allowedOrigin }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), allowedOrigin);
  assert.deepEqual(await response.json(), {
    platform: "HedgeX Pro",
    environment: "foundation",
    accountAuthorization: "not_configured",
    botRuntime: "not_configured",
    orderExecution: "disabled",
    demoExecutionEnabled: false
  });
});

test("unapproved browser origins and unimplemented token routes are rejected", async () => {
  const blocked = await fetch(baseUrl + "/health", {
    headers: { Origin: "https://untrusted.example" }
  });
  assert.equal(blocked.status, 400);

  const tokenRoute = await fetch(baseUrl + "/api/deriv/token/connect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: "not-a-real-token" })
  });
  assert.equal(tokenRoute.status, 404);
});
