import http from "node:http";
import { openDb } from "./db.js";
import { createCustomersRouter, customersCollectionRoute } from "./routes/customers.js";

const PORT = 5000;

const db = openDb();
const customersRoute = createCustomersRouter(db);

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, status, obj) {
  setCors(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      return sendJson(res, 200, { ok: true });
    }

    // POST /customers (collection)
    const handled = await customersCollectionRoute(req, res, url, db);
    if (handled) return;

    // /customers and /customers/:id
    if (url.pathname === "/customers" || url.pathname.startsWith("/customers/")) {
      return customersRoute(req, res, url);
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch (e) {
    return sendJson(res, 500, { error: "Server error", detail: e?.message ?? String(e) });
  }
});

server.listen(PORT, () => {
  console.log(`SubTrack API running on http://localhost:${PORT}`);
});

