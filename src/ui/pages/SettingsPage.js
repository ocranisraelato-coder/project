import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card, CardHeader } from "../components/Card.js";
import { Button } from "../components/Button.js";
import { getStoredThemePreference, setStoredThemePreference, ensureThemeApplied } from "../theme.js";

const html = htm.bind(React.createElement);

export function SettingsPage() {
  const [pref, setPref] = React.useState(getStoredThemePreference());

  const setThemePref = (p) => {
    setStoredThemePreference(p);
    ensureThemeApplied();
    setPref(p);
  };

  return html`
    <div className="space-y-6">
      <${Card}>
        <${CardHeader} title="Appearance" subtitle="Theme preference is stored locally in your browser" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <${Button} variant=${pref === "light" ? "primary" : "secondary"} onClick=${() => setThemePref("light")}>
            Light
          </${Button}>
          <${Button} variant=${pref === "dark" ? "primary" : "secondary"} onClick=${() => setThemePref("dark")}>
            Dark
          </${Button}>
          <${Button} variant=${pref === "system" ? "primary" : "secondary"} onClick=${() => setThemePref("system")}>
            System
          </${Button}>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          This demo UI focuses on frontend UX. You can wire these components to your backend (DSTV account data, renewals, etc.) later.
        </div>
      </${Card}>

      <${Card}>
        <${CardHeader} title="Account" subtitle="Demo actions" />
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Use the logout button in the top bar to return to the login screen.
        </div>
      </${Card}>
    </div>
  `;
}

