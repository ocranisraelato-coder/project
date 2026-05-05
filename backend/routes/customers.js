function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function notFound(res) {
  sendJson(res, 404, { error: "Not found" });
}

function badRequest(res, message) {
  sendJson(res, 400, { error: message || "Bad request" });
}

function validateCustomerInput(body) {
  const payload = {
    name: (body?.name ?? "").trim(),
    phone: (body?.phone ?? "").trim(),
    iuc: (body?.iuc ?? "").trim(),
    username: (body?.username ?? "").trim(),
    package: (body?.package ?? "").trim(),
    startDate: (body?.startDate ?? "").trim(),
    expiryDate: (body?.expiryDate ?? "").trim(),
    notes: (body?.notes ?? "").trim(),
  };

  if (!payload.name) return { ok: false, error: "name is required" };
  if (!payload.phone) return { ok: false, error: "phone is required" };
  if (!payload.iuc) return { ok: false, error: "iuc is required" };
  if (!payload.package) return { ok: false, error: "package is required" };
  if (!payload.startDate) return { ok: false, error: "startDate is required" };
  if (!payload.expiryDate) return { ok: false, error: "expiryDate is required" };

  return { ok: true, payload };
}

export function createCustomersRouter(db) {
  const listStmt = db.prepare(`
    SELECT id, name, phone, iuc, username, package, startDate, expiryDate, notes, createdAt
    FROM customers
    ORDER BY datetime(createdAt) DESC, id DESC
  `);

  const getStmt = db.prepare(`
    SELECT id, name, phone, iuc, username, package, startDate, expiryDate, notes, createdAt
    FROM customers
    WHERE id = ?
    LIMIT 1
  `);

  const insertStmt = db.prepare(`
    INSERT INTO customers (name, phone, iuc, username, package, startDate, expiryDate, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const updateStmt = db.prepare(`
    UPDATE customers
    SET name = ?, phone = ?, iuc = ?, username = ?, package = ?, startDate = ?, expiryDate = ?, notes = ?
    WHERE id = ?
  `);

  const deleteStmt = db.prepare(`DELETE FROM customers WHERE id = ?`);

  return async function customersRoute(req, res, url) {
    // GET /customers
    if (req.method === "GET" && url.pathname === "/customers") {
      const rows = listStmt.all();
      return sendJson(res, 200, { data: rows });
    }

    // /customers/:id
    const match = url.pathname.match(/^\/customers\/(\d+)$/);
    if (!match) return notFound(res);
    const id = Number(match[1]);
    if (!Number.isFinite(id)) return badRequest(res, "Invalid id");

    if (req.method === "GET") {
      const row = getStmt.get(id);
      if (!row) return notFound(res);
      return sendJson(res, 200, { data: row });
    }

    if (req.method === "POST") {
      return badRequest(res, "Use POST /customers (no id) to create");
    }

    if (req.method === "PUT") {
      let body;
      try {
        body = await readJson(req);
      } catch (e) {
        return badRequest(res, e.message);
      }

      const v = validateCustomerInput(body);
      if (!v.ok) return badRequest(res, v.error);

      const info = updateStmt.run(
        v.payload.name,
        v.payload.phone,
        v.payload.iuc,
        v.payload.username,
        v.payload.package,
        v.payload.startDate,
        v.payload.expiryDate,
        v.payload.notes,
        id,
      );

      if (info.changes === 0) return notFound(res);
      const row = getStmt.get(id);
      return sendJson(res, 200, { data: row });
    }

    if (req.method === "DELETE") {
      const info = deleteStmt.run(id);
      if (info.changes === 0) return notFound(res);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  };
}

export async function customersCollectionRoute(req, res, url, db) {
  // POST /customers
  if (req.method !== "POST" || url.pathname !== "/customers") return false;

  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    badRequest(res, e.message);
    return true;
  }

  const v = validateCustomerInput(body);
  if (!v.ok) {
    badRequest(res, v.error);
    return true;
  }

  const insertStmt = db.prepare(`
    INSERT INTO customers (name, phone, iuc, username, package, startDate, expiryDate, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = insertStmt.run(
    v.payload.name,
    v.payload.phone,
    v.payload.iuc,
    v.payload.username,
    v.payload.package,
    v.payload.startDate,
    v.payload.expiryDate,
    v.payload.notes,
  );

  const getStmt = db.prepare(`
    SELECT id, name, phone, iuc, username, package, startDate, expiryDate, notes, createdAt
    FROM customers
    WHERE id = ?
    LIMIT 1
  `);

  const row = getStmt.get(info.lastInsertRowid);
  sendJson(res, 201, { data: row });
  return true;
}

