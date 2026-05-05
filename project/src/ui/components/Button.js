import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { cn } from "../utils.js";

const html = htm.bind(React.createElement);

export function Button({
  children,
  variant = "primary", // primary | secondary | ghost | danger
  size = "md", // sm | md
  className = "",
  type = "button",
  disabled,
  onClick,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed";

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };

  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-soft hover:bg-indigo-700 active:bg-indigo-700 " +
      "dark:bg-indigo-500 dark:hover:bg-indigo-600",
    secondary:
      "bg-white text-slate-900 shadow-soft ring-1 ring-slate-200 hover:bg-slate-50 active:bg-slate-50 " +
      "dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-800 dark:hover:bg-slate-800",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-100 " +
      "dark:text-slate-200 dark:hover:bg-slate-900 dark:active:bg-slate-900",
    danger:
      "bg-rose-600 text-white shadow-soft hover:bg-rose-700 active:bg-rose-700 " +
      "dark:bg-rose-500 dark:hover:bg-rose-600",
  };

  return html`
    <button
      type=${type}
      className=${cn(base, sizes[size], variants[variant], className)}
      disabled=${disabled}
      onClick=${onClick}
    >
      ${children}
    </button>
  `;
}

