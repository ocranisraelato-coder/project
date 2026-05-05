import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Button } from "../components/Button.js";
import { Input } from "../components/Input.js";
import { LogoMark } from "../components/Icons.js";

const html = htm.bind(React.createElement);

export function LoginPage({ onLogin }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password.");
      return;
    }
    onLogin?.({ username: username.trim() });
  };

  return html`
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1100px] items-center justify-center px-4 py-10">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-3">
              <${LogoMark} className="h-10 w-10" />
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">SubTrack</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Customer Subscription Management
                </div>
              </div>
            </div>
            <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
              Monitor renewals, flag expiries, and keep your customer base organized — with a clean, production-ready UI.
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Fast</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Instant search & CSV export.</div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Clean</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Modern SaaS layout & dark mode.</div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <div className="mb-5 flex items-center gap-3 md:hidden">
                <${LogoMark} className="h-10 w-10" />
                <div>
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-50">SubTrack</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Sign in</div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="text-base font-semibold text-slate-900 dark:text-slate-50">Welcome back</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Login to manage subscriptions.</div>
              </div>

              <form className="mt-5 space-y-3" onSubmit=${submit}>
                <${Input}
                  label="Username"
                  placeholder="e.g. admin"
                  value=${username}
                  onInput=${(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
                <${Input}
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  value=${password}
                  onInput=${(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                ${error
                  ? html`<div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:ring-rose-900/40">
                      ${error}
                    </div>`
                  : null}
                <div className="pt-1">
                  <${Button} type="submit" className="w-full">Login</${Button}>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Demo: any username/password works.
                </div>
              </form>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              © ${new Date().getFullYear()} SubTrack. SaaS-style dashboard UI.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

