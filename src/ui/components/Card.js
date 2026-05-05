import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { cn } from "../utils.js";

const html = htm.bind(React.createElement);

export function Card({ children, className = "" }) {
  return html`
    <div
      className=${cn(
        "rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800",
        className,
      )}
    >
      ${children}
    </div>
  `;
}

export function CardHeader({ title, subtitle, right }) {
  return html`
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">${title}</div>
        ${subtitle
          ? html`<div className="mt-1 text-xs text-slate-500 dark:text-slate-400">${subtitle}</div>`
          : null}
      </div>
      ${right}
    </div>
  `;
}

