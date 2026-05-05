export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function formatDateISOToHuman(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function startOfTodayMs() {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d.getTime();
}

export function daysUntil(iso) {
  if (!iso) return null;
  const expiry = new Date(iso + "T00:00:00").getTime();
  if (Number.isNaN(expiry)) return null;
  const diffMs = expiry - startOfTodayMs();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export function statusForExpiry(iso) {
  const d = daysUntil(iso);
  if (d == null) return { status: "Unknown", kind: "unknown", days: null };
  if (d < 0) return { status: "Expired", kind: "expired", days: d };
  if (d === 0) return { status: "Expires today", kind: "warning", days: d };
  return { status: "Active", kind: "active", days: d };
}

export function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export function downloadTextFile(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

