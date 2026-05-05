const API_BASE = "http://localhost:5000";

async function readJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function httpError(status, payload) {
  const msg =
    payload?.error ||
    payload?.message ||
    (status === 0 ? "Network error" : `Request failed (${status})`);
  const err = new Error(msg);
  err.status = status;
  err.payload = payload;
  return err;
}

export async function apiGetCustomers() {
  const res = await fetch(`${API_BASE}/customers`);
  const payload = await readJson(res);
  if (!res.ok) throw httpError(res.status, payload);
  return payload?.data ?? [];
}

export async function apiCreateCustomer(customer) {
  const res = await fetch(`${API_BASE}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  const payload = await readJson(res);
  if (!res.ok) throw httpError(res.status, payload);
  return payload?.data;
}

export async function apiUpdateCustomer(id, customer) {
  const res = await fetch(`${API_BASE}/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  const payload = await readJson(res);
  if (!res.ok) throw httpError(res.status, payload);
  return payload?.data;
}

export async function apiDeleteCustomer(id) {
  const res = await fetch(`${API_BASE}/customers/${id}`, { method: "DELETE" });
  const payload = await readJson(res);
  if (!res.ok) throw httpError(res.status, payload);
  return payload;
}

