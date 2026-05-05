import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card, CardHeader } from "../components/Card.js";
import { cn, clamp, statusForExpiry } from "../utils.js";

const html = htm.bind(React.createElement);

function StatCard({ title, value, color, subtitle, right }) {
  const accent =
    color === "green"
      ? "from-emerald-500 to-emerald-600"
      : color === "red"
        ? "from-rose-500 to-rose-600"
        : "from-indigo-500 to-blue-600";

  return html`
    <div
      className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    >
      <div className=${cn("absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-20", accent)}></div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">${title}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">${value}</div>
          ${subtitle ? html`<div className="mt-1 text-xs text-slate-500 dark:text-slate-400">${subtitle}</div>` : null}
        </div>
        ${right}
      </div>
    </div>
  `;
}

function Progress({ label, value, color }) {
  const pct = clamp(Math.round(value * 100), 0, 100);
  const bar =
    color === "green"
      ? "bg-emerald-500"
      : color === "red"
        ? "bg-rose-500"
        : "bg-indigo-500";
  return html`
    <div>
      <div className="flex items-center justify-between text-xs">
        <div className="font-medium text-slate-700 dark:text-slate-200">${label}</div>
        <div className="text-slate-500 dark:text-slate-400">${pct}%</div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <div className=${cn("h-full rounded-full transition-all", bar)} style=${{ width: `${pct}%` }}></div>
      </div>
    </div>
  `;
}

export function DashboardPage({ customers }) {
  const stats = React.useMemo(() => {
    const total = customers.length;
    let active = 0;
    let expired = 0;
    let warning = 0;
    for (const c of customers) {
      const s = statusForExpiry(c.expiryDate);
      if (s.kind === "expired") expired += 1;
      else if (s.kind === "warning") warning += 1;
      else if (s.kind === "active") active += 1;
    }
    return { total, active, expired, warning };
  }, [customers]);

  const activeRate = stats.total ? stats.active / stats.total : 0;
  const expiredRate = stats.total ? stats.expired / stats.total : 0;
  const warningRate = stats.total ? stats.warning / stats.total : 0;

  return html`
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <${StatCard}
          title="Total Customers"
          value=${stats.total}
          color="blue"
          subtitle="All customer records"
        />
        <${StatCard}
          title="Active Subscriptions"
          value=${stats.active}
          color="green"
          subtitle="Not yet expired"
        />
        <${StatCard}
          title="Expired Subscriptions"
          value=${stats.expired}
          color="red"
          subtitle=${stats.warning ? `${stats.warning} expiring today` : "Needs renewal"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <${Card}>
            <${CardHeader}
              title="Subscription health"
              subtitle="Quick distribution across your customer base"
            />
            <div className="space-y-4">
              <${Progress} label="Active" value=${activeRate} color="green" />
              <${Progress} label="Expired" value=${expiredRate} color="red" />
              <${Progress} label="Expiring today" value=${warningRate} color="blue" />
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-slate-800">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Operational hint</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Focus outreach on <span className="font-semibold text-rose-600 dark:text-rose-400">expired</span> first, then customers expiring today.
              </div>
            </div>
          </${Card}>
        </div>

        <div className="lg:col-span-2">
          <${Card}>
            <${CardHeader} title="Recent activity (mock)" subtitle="UI placeholder for events/logs" />
            <div className="space-y-3">
              ${[
                { t: "CSV exported", d: "Customers list exported by admin", k: "info" },
                { t: "Customer updated", d: "Package changed to Compact Plus", k: "success" },
                { t: "Expiry flagged", d: "2 customers expiring this week", k: "warning" },
              ].map(
                (x, idx) => html`
                  <div
                    key=${idx}
                    className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">${x.t}</div>
                      <span
                        className=${cn(
                          "rounded-full px-2 py-1 text-xs font-semibold",
                          x.k === "success"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200"
                            : x.k === "warning"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-200"
                              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200",
                        )}
                      >
                        ${x.k}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">${x.d}</div>
                  </div>
                `,
              )}
            </div>
          </${Card}>
        </div>
      </div>
    </div>
  `;
}

