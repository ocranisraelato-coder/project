import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Button } from "./Button.js";
import { Bars3Icon, MoonIcon, SunIcon } from "./Icons.js";
import { toggleThemeQuick, ensureThemeApplied } from "../theme.js";

const html = htm.bind(React.createElement);

export function TopBar({ title, subtitle, onMenuClick, right }) {
  const [theme, setTheme] = React.useState(() => {
    // for the icon; applied by ensureThemeApplied already
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  React.useEffect(() => {
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;
    const handler = () => {
      ensureThemeApplied();
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  return html`
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50 md:hidden"
            onClick=${onMenuClick}
            aria-label="Open menu"
          >
            <${Bars3Icon} />
          </button>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">${title}</div>
            ${subtitle
              ? html`<div className="truncate text-xs text-slate-500 dark:text-slate-400">${subtitle}</div>`
              : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          ${right}
          <${Button}
            variant="ghost"
            size="sm"
            onClick=${() => {
              const next = toggleThemeQuick();
              setTheme(next);
            }}
          >
            ${theme === "dark"
              ? html`<${SunIcon} /><span className="hidden sm:inline">Light</span>`
              : html`<${MoonIcon} /><span className="hidden sm:inline">Dark</span>`}
          </${Button}>
        </div>
      </div>
    </div>
  `;
}

