import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { cn } from "../utils.js";

const html = htm.bind(React.createElement);

export function Input({ label, hint, error, className = "", inputClassName = "", ...props }) {
  return html`
    <label className=${cn("block", className)}>
      ${label
        ? html`<div className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
            ${label}
          </div>`
        : null}
      <input
        className=${cn(
          "h-11 w-full rounded-xl bg-white px-3 text-sm text-slate-900 shadow-soft ring-1 ring-slate-200 transition " +
            "placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/70 focus:outline-none " +
            "dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-800 dark:placeholder:text-slate-500",
          error ? "ring-rose-300 focus:ring-rose-500/70 dark:ring-rose-900/60" : "",
          inputClassName,
        )}
        ...${props}
      />
      ${error
        ? html`<div className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">${error}</div>`
        : hint
          ? html`<div className="mt-1 text-xs text-slate-500 dark:text-slate-400">${hint}</div>`
          : null}
    </label>
  `;
}

