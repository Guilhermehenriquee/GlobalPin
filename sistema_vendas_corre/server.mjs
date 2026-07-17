import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const root = fileURLToPath(new URL(".", import.meta.url));
const webRoot = join(root, "web");
const dataDir = join(root, "db");
const inboxPath = join(dataDir, "whatsapp_inbox.json");
const port = Number.parseInt(process.env.PORT || "5173", 10);
const host = process.env.HOST || "0.0.0.0";
const sseClients = new Set();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

function ensureStore() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(inboxPath)) writeFileSync(inboxPath, JSON.stringify({ events: [], replies: [] }, null, 2));
}

function readStore() {
  ensureStore();
  try {
    return JSON.parse(readFileSync(inboxPath, "utf8"));
  } catch {
    return { events: [], replies: [] };
  }
}

function writeStore(store) {
  ensureStore();
  writeFileSync(inboxPath, JSON.stringify(store, null, 2));
}

function sendJson(res, payload, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error("payload grande demais"));
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function normalizePhone(value = "") {
  return String(value).replace(/\D/g, "");
}

function createWhatsappEvent(payload, type = "contact") {
  const phone = payload.phone || payload.from || payload.number || "";
  const name = payload.name || payload.contactName || payload.pushName || "";
  const body = payload.body || payload.message || payload.text || name || "";
  return {
    id: payload.id || `WPP-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    type,
    createdAt: payload.createdAt || new Date().toISOString(),
    phone,
    from: phone,
    name,
    contactName: name,
    body,
    message: body,
    referredBy: payload.referredBy || ""
  };
}

function broadcast(event) {
  const wire = `event: whatsapp\ndata: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    client.write(wire);
  }
}

async function sendViaCloudApi(to, body) {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return { sent: false, mode: "queued" };

  const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizePhone(to),
      type: "text",
      text: { body }
    })
  });

  const data = await response.json().catch(() => ({}));
  return { sent: response.ok, mode: "cloud-api", data };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, { ok: true, whatsapp: true });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/whatsapp/inbox") {
    sendJson(res, readStore());
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/whatsapp/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    res.write("event: ready\ndata: {}\n\n");
    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
    return true;
  }

  if (req.method === "POST" && ["/api/whatsapp/contact", "/api/whatsapp/message"].includes(url.pathname)) {
    const payload = await readBody(req);
    const event = createWhatsappEvent(payload, url.pathname.endsWith("message") ? "message" : "contact");
    if (!normalizePhone(event.phone) || !event.name && !event.body) {
      sendJson(res, { ok: false, error: "Envie phone e name/body." }, 400);
      return true;
    }
    const store = readStore();
    store.events.unshift(event);
    store.events = store.events.slice(0, 500);
    writeStore(store);
    broadcast(event);
    sendJson(res, { ok: true, event });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/whatsapp/reply") {
    const payload = await readBody(req);
    if (!normalizePhone(payload.to) || !payload.body) {
      sendJson(res, { ok: false, error: "Envie to e body." }, 400);
      return true;
    }
    const result = await sendViaCloudApi(payload.to, payload.body);
    const store = readStore();
    store.replies.unshift({
      id: `RPL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      to: payload.to,
      body: payload.body,
      sent: result.sent,
      mode: result.mode
    });
    store.replies = store.replies.slice(0, 500);
    writeStore(store);
    sendJson(res, { ok: true, ...result });
    return true;
  }

  return false;
}

function serveStatic(req, res, url) {
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = normalize(join(webRoot, requested));
  if (!filePath.startsWith(webRoot) || !existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    try {
      if (url.pathname.startsWith("/api/") && (await handleApi(req, res, url))) return;
      serveStatic(req, res, url);
    } catch (error) {
      sendJson(res, { ok: false, error: error.message || "Erro interno" }, 500);
    }
  })
  .listen(port, host, () => {
    console.log(`Sistema de Vendas Corre rodando em ${host}:${port}`);
  });
