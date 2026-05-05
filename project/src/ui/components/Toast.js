import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { cn } from "../utils.js";

const html = htm.bind(React.createElement);

const ToastCtx = React.createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const push = React.useCallback((t) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const toast = { id, kind: t.kind ?? "info", title: t.title ?? "", message: t.message ?? "" };
    setToasts((prev) => [...prev, toast]);
    const ms = t.durationMs ?? 2800;
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, ms);
  }, []);

  const api = React.useMemo(
    () => ({
      info: (title, message, opts) => push({ kind: "info", title, message, ...opts }),
      success: (title, message, opts) => push({ kind: "success", title, message, ...opts }),
      warning: (title, message, opts) => push({ kind: "warning", title, message, ...opts }),
      error: (title, message, opts) => push({ kind: "error", title, message, ...opts }),
    }),
    [push],
  );

  return html`
    <${ToastCtx.Provider} value=${api}>
      ${children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
        ${toasts.map(
          (t) => html`<${ToastItem} key=${t.id} toast=${t} />`,
        )}
      </div>
    </${ToastCtx.Provider}>
  `;
}

export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastItem({ toast }) {
  const { kind, title, message } = toast;
  const accent =
    kind === "success"
      ? "bg-emerald-500"
      : kind === "warning"
        ? "bg-amber-500"
        : kind === "error"
          ? "bg-rose-500"
          : "bg-indigo-500";

  return html`
    <div
      className="pointer-events-auto overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    >
      <div className="flex items-start gap-3 p-3.5">
        <div className=${cn("mt-1 h-2.5 w-2.5 rounded-full", accent)}></div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">${title}</div>
          ${message
            ? html`<div className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">${message}</div>`
            : null}
        </div>
      </div>
    </div>
  `;
}

