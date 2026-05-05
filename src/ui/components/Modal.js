import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { cn } from "../utils.js";
import { XIcon } from "./Icons.js";

const html = htm.bind(React.createElement);

export function Modal({ open, title, description, children, onClose, footer }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return html`
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick=${() => onClose?.()}
      ></div>
      <div className="absolute inset-0 flex items-end justify-center p-4 sm:items-center">
        <div
          role="dialog"
          aria-modal="true"
          className=${cn(
            "w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800",
          )}
        >
          <div className="flex items-start justify-between gap-3 p-5">
            <div className="min-w-0">
              <div className="text-base font-semibold text-slate-900 dark:text-slate-50">${title}</div>
              ${description
                ? html`<div className="mt-1 text-sm text-slate-600 dark:text-slate-300">${description}</div>`
                : null}
            </div>
            <button
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              onClick=${() => onClose?.()}
              aria-label="Close"
            >
              <${XIcon} />
            </button>
          </div>
          <div className="px-5 pb-5">${children}</div>
          ${footer ? html`<div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">${footer}</div>` : null}
        </div>
      </div>
    </div>
  `;
}

