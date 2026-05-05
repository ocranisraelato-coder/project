import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { cn } from "../utils.js";
import { isRoute } from "../router.js";
import { LogoMark } from "./Icons.js";

const html = htm.bind(React.createElement);

function NavItem({ active, label, onClick }) {
  return html`
    <button
      onClick=${onClick}
      className=${cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-indigo-600 text-white shadow-soft"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
      )}
    >
      <span>${label}</span>
      ${active ? html`<span className="h-1.5 w-1.5 rounded-full bg-white/90"></span>` : null}
    </button>
  `;
}

export function Sidebar({ path, navigate, collapsed, setCollapsed }) {
  const items = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/customers", label: "Customers" },
    { to: "/settings", label: "Settings" },
  ];

  return html`
    <div
      className=${cn(
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white/90 backdrop-blur " +
          "dark:border-slate-800 dark:bg-slate-950/75",
        collapsed ? "hidden md:block" : "block",
      )}
    >
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <${LogoMark} className="h-9 w-9" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">SubTrack</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Subscriptions</div>
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-1">
          ${items.map(
            (it) =>
              html`<${NavItem}
                key=${it.to}
                label=${it.label}
                active=${isRoute(path, it.to)}
                onClick=${() => {
                  navigate(it.to);
                  setCollapsed?.(true);
                }}
              />`,
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Tip</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Export customers to CSV, or filter by IUC/phone instantly.
          </div>
        </div>
      </div>
    </div>
  `;
}

export function SidebarOverlay({ open, onClose }) {
  if (!open) return null;
  return html`<div className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[1px] md:hidden" onClick=${onClose}></div>`;
}

