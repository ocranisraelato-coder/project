import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";

import { Card, CardHeader } from "../components/Card.js";
import { Button } from "../components/Button.js";
import { Input } from "../components/Input.js";
import { Modal } from "../components/Modal.js";
import { DownloadIcon, PlusIcon, SearchIcon } from "../components/Icons.js";
import {
  cn,
  clamp,
  csvEscape,
  daysUntil,
  downloadTextFile,
  formatDateISOToHuman,
  statusForExpiry,
} from "../utils.js";

const html = htm.bind(React.createElement);

function StatusPill({ expiryDate }) {
  const s = statusForExpiry(expiryDate);
  const cls =
    s.kind === "expired"
      ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:ring-rose-900/40"
      : s.kind === "warning"
        ? "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-900/40"
        : s.kind === "active"
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:ring-emerald-900/40"
          : "bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-200 dark:ring-slate-800";

  const extra =
    s.kind === "active" ? `${Math.max(0, s.days)} days left` : s.kind === "expired" ? `${Math.abs(s.days)} days ago` : "";

  return html`<span className=${cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1", cls)}>
    ${s.status}${extra ? html`<span className="font-medium opacity-80">· ${extra}</span>` : null}
  </span>`;
}

function Pager({ page, pageCount, onPage }) {
  const canPrev = page > 1;
  const canNext = page < pageCount;
  return html`
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-slate-500 dark:text-slate-400">Page ${page} of ${pageCount}</div>
      <div className="flex items-center gap-2">
        <${Button} size="sm" variant="secondary" disabled=${!canPrev} onClick=${() => onPage(page - 1)}>Prev</${Button}>
        <${Button} size="sm" variant="secondary" disabled=${!canNext} onClick=${() => onPage(page + 1)}>Next</${Button}>
      </div>
    </div>
  `;
}

function CustomerForm({ initial, onSubmit }) {
  const [form, setForm] = React.useState(() => ({
    name: initial?.name ?? "",
    phone: initial?.phone ?? "",
    iuc: initial?.iuc ?? "",
    username: initial?.username ?? "",
    pkg: initial?.package ?? initial?.pkg ?? "Compact",
    startDate: initial?.startDate ?? "",
    expiryDate: initial?.expiryDate ?? "",
    notes: initial?.notes ?? "",
  }));
  const [errors, setErrors] = React.useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone is required";
    if (!form.iuc.trim()) nextErrors.iuc = "IUC number is required";
    if (!form.startDate.trim()) nextErrors.startDate = "Start date is required";
    if (!form.expiryDate.trim()) nextErrors.expiryDate = "Expiry date is required";
    if (!form.pkg.trim()) nextErrors.pkg = "Package is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit?.({
      ...initial,
      name: form.name.trim(),
      phone: form.phone.trim(),
      iuc: form.iuc.trim(),
      username: form.username.trim(),
      package: form.pkg,
      startDate: form.startDate.trim(),
      expiryDate: form.expiryDate.trim(),
      notes: form.notes.trim(),
    });
  };

  return html`
    <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit=${submit}>
      <${Input}
        label="Name"
        value=${form.name}
        onInput=${(e) => set("name", e.target.value)}
        error=${errors.name}
        placeholder="Customer name"
      />
      <${Input}
        label="Phone"
        value=${form.phone}
        onInput=${(e) => set("phone", e.target.value)}
        error=${errors.phone}
        placeholder="+27 71 ..."
      />
      <${Input}
        label="IUC Number"
        value=${form.iuc}
        onInput=${(e) => set("iuc", e.target.value)}
        error=${errors.iuc}
        placeholder="e.g. 7039 1182 5401"
        className="sm:col-span-2"
      />
      <${Input}
        label="Username (optional)"
        value=${form.username}
        onInput=${(e) => set("username", e.target.value)}
        placeholder="e.g. john123"
      />

      <label className="block">
        <div className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Package</div>
        <select
          className="h-11 w-full rounded-xl bg-white px-3 text-sm text-slate-900 shadow-soft ring-1 ring-slate-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/70 dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-800"
          value=${form.pkg}
          onChange=${(e) => set("pkg", e.target.value)}
        >
          ${["Access", "Family", "Compact", "Compact Plus", "Premium"].map(
            (p) => html`<option key=${p} value=${p}>${p}</option>`,
          )}
        </select>
        ${errors.pkg
          ? html`<div className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">${errors.pkg}</div>`
          : null}
      </label>

      <${Input}
        label="Start Date"
        type="date"
        value=${form.startDate}
        onInput=${(e) => set("startDate", e.target.value)}
        error=${errors.startDate}
      />

      <${Input}
        label="Expiry Date"
        type="date"
        value=${form.expiryDate}
        onInput=${(e) => set("expiryDate", e.target.value)}
        error=${errors.expiryDate}
      />

      <label className="block sm:col-span-2">
        <div className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Notes (optional)</div>
        <textarea
          className="min-h-[92px] w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 shadow-soft ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-800 dark:placeholder:text-slate-500"
          value=${form.notes}
          onInput=${(e) => set("notes", e.target.value)}
          placeholder="e.g. Paid via mobile money"
        ></textarea>
      </label>

      <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
        <${Button} type="submit">${initial ? "Save changes" : "Add customer"}</${Button}>
      </div>
    </form>
  `;
}

export function CustomersPage({ customers, loading, error, onRefresh, onCreate, onUpdate, onDelete }) {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [saving, setSaving] = React.useState(false);

  const pageSize = 6;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.iuc.toLowerCase().includes(q)
      );
    });
  }, [customers, query]);

  const sorted = React.useMemo(() => {
    // Sort: expired first, then by soonest expiry
    return [...filtered].sort((a, b) => {
      const da = daysUntil(a.expiryDate);
      const db = daysUntil(b.expiryDate);
      const aExpired = da != null && da < 0 ? 1 : 0;
      const bExpired = db != null && db < 0 ? 1 : 0;
      if (aExpired !== bExpired) return bExpired - aExpired;
      if (da == null && db == null) return 0;
      if (da == null) return 1;
      if (db == null) return -1;
      return da - db;
    });
  }, [filtered]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = clamp(page, 1, pageCount);
  const rows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setModalOpen(true);
  };

  const remove = async (c) => {
    if (!confirm(`Delete customer "${c.name}"?`)) return;
    setSaving(true);
    try {
      await onDelete?.(c.id, c.name);
    } finally {
      setSaving(false);
    }
  };

  const upsert = async (cust) => {
    setSaving(true);
    try {
      if (!cust.id) await onCreate?.(cust);
      else await onUpdate?.(cust.id, cust);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const header = [
      "Name",
      "Phone",
      "IUC Number",
      "Username",
      "Package",
      "Start Date",
      "Expiry Date",
      "Status",
      "Notes",
    ];
    const lines = [header.map(csvEscape).join(",")];
    for (const c of sorted) {
      const s = statusForExpiry(c.expiryDate).status;
      lines.push(
        [
          c.name,
          c.phone,
          c.iuc,
          c.username ?? "",
          c.package ?? c.pkg ?? "",
          c.startDate ?? "",
          c.expiryDate,
          s,
          c.notes ?? "",
        ]
          .map(csvEscape)
          .join(","),
      );
    }
    downloadTextFile(`subtrack-customers-${new Date().toISOString().slice(0, 10)}.csv`, lines.join("\n"), "text/csv");
  };

  return html`
    <div className="space-y-6">
      <${Card}>
        <${CardHeader}
          title="Customers"
          subtitle="Search, add, edit, export, and track subscription expiry at a glance"
          right=${html`
            <div className="flex items-center gap-2">
              <${Button} variant="secondary" size="sm" onClick=${exportCsv}>
                <${DownloadIcon} />
                <span className="hidden sm:inline">Export CSV</span>
              </${Button}>
              <${Button} size="sm" onClick=${openAdd} disabled=${saving || loading}>
                <${PlusIcon} />
                <span className="hidden sm:inline">Add Customer</span>
                <span className="sm:hidden">Add</span>
              </${Button}>
            </div>
          `}
        />

        ${error
          ? html`<div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:ring-rose-900/40">
              <div className="font-semibold">Failed to load customers</div>
              <div className="mt-1">${error}</div>
              <div className="mt-3">
                <${Button} size="sm" variant="secondary" onClick=${onRefresh} disabled=${loading}>
                  ${loading ? "Retrying…" : "Retry"}
                </${Button}>
              </div>
            </div>`
          : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <${SearchIcon} />
            </div>
            <input
              className="h-11 w-full rounded-xl bg-white pl-10 pr-3 text-sm text-slate-900 shadow-soft ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-800 dark:placeholder:text-slate-500"
              placeholder="Search name, phone, or IUC…"
              value=${query}
              disabled=${loading}
              onInput=${(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            ${loading
              ? html`Loading…`
              : html`Showing <span className="font-semibold text-slate-700 dark:text-slate-200">${sorted.length}</span> customers`}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-separate border-spacing-0 bg-white dark:bg-slate-900">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
                <tr>
                  ${["Name", "Phone", "IUC Number", "Package", "Expiry Date", "Status", "Actions"].map(
                    (h) => html`<th key=${h} className="whitespace-nowrap px-4 py-3">${h}</th>`,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.length
                  ? rows.map((c) => {
                      const s = statusForExpiry(c.expiryDate);
                      const expiredRow = s.kind === "expired";
                      return html`
                        <tr
                          key=${c.id}
                          className=${cn(
                            "border-t border-slate-100 align-top text-sm dark:border-slate-800",
                            expiredRow ? "bg-rose-50/40 dark:bg-rose-950/15" : "bg-white dark:bg-slate-900",
                          )}
                        >
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 dark:text-slate-50">${c.name}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">${c.phone}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-200">${c.iuc}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">${c.package ?? c.pkg}</td>
                          <td className=${cn("px-4 py-3", expiredRow ? "text-rose-700 dark:text-rose-300" : "text-slate-600 dark:text-slate-300")}>
                            ${formatDateISOToHuman(c.expiryDate)}
                          </td>
                          <td className="px-4 py-3">
                            <${StatusPill} expiryDate=${c.expiryDate} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <${Button} size="sm" variant="secondary" onClick=${() => openEdit(c)} disabled=${saving || loading}>Edit</${Button}>
                              <${Button} size="sm" variant="ghost" disabled=${saving || loading} className="text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/30" onClick=${() => remove(c)}>
                                Delete
                              </${Button}>
                            </div>
                          </td>
                        </tr>
                      `;
                    })
                  : html`
                      <tr>
                        <td className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400" colSpan="7">
                          ${loading ? "Loading customers…" : "No customers match your search."}
                        </td>
                      </tr>
                    `}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <${Pager} page=${safePage} pageCount=${pageCount} onPage=${(p) => setPage(p)} />
        </div>
      </${Card}>

      <${Modal}
        open=${modalOpen}
        title=${editing ? "Edit customer" : "Add customer"}
        description="Manage core subscription fields. Expiry date determines status."
        onClose=${() => (saving ? null : setModalOpen(false))}
      >
        <${CustomerForm} initial=${editing} onSubmit=${upsert} />
        ${saving
          ? html`<div className="mt-3 text-xs text-slate-500 dark:text-slate-400">Saving…</div>`
          : null}
      </${Modal}>
    </div>
  `;
}

