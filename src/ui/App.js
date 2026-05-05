import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";

import { useHashRouter } from "./router.js";
import { getAuth, setAuth, clearAuth } from "./storage.js";
import { apiCreateCustomer, apiDeleteCustomer, apiGetCustomers, apiUpdateCustomer } from "./api.js";

import { ToastProvider, useToast } from "./components/Toast.js";
import { Sidebar, SidebarOverlay } from "./components/Sidebar.js";
import { TopBar } from "./components/TopBar.js";
import { Button } from "./components/Button.js";
import { Card } from "./components/Card.js";

import { LoginPage } from "./pages/LoginPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { CustomersPage } from "./pages/CustomersPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";

const html = htm.bind(React.createElement);

function AppInner() {
  const { path, navigate } = useHashRouter();
  const toast = useToast();

  const [auth, setAuthState] = React.useState(() => getAuth());
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  const [customers, setCustomers] = React.useState([]);
  const [loadingCustomers, setLoadingCustomers] = React.useState(false);
  const [customersError, setCustomersError] = React.useState("");

  React.useEffect(() => {
    // Guard routes
    if (!auth.loggedIn && path !== "/login") navigate("/login");
    if (auth.loggedIn && path === "/login") navigate("/dashboard");
  }, [auth.loggedIn, path, navigate]);

  const loadCustomers = React.useCallback(async () => {
    setLoadingCustomers(true);
    setCustomersError("");
    try {
      const data = await apiGetCustomers();
      setCustomers(data);
    } catch (e) {
      setCustomersError(e?.message ?? "Failed to load customers");
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  React.useEffect(() => {
    if (!auth.loggedIn) return;
    loadCustomers();
  }, [auth.loggedIn, loadCustomers]);

  const logout = () => {
    clearAuth();
    setAuthState({ loggedIn: false, username: "" });
    toast.info("Signed out", "You’ve been logged out.");
    navigate("/login");
  };

  if (!auth.loggedIn) {
    return html`
      <${LoginPage}
        onLogin=${({ username }) => {
          const next = { loggedIn: true, username };
          setAuth(next);
          setAuthState(next);
          toast.success("Welcome", `Signed in as ${username}.`);
          navigate("/dashboard");
        }}
      />
    `;
  }

  let title = "Dashboard";
  let subtitle = "Overview of your subscription base";
  let content = customersError
    ? html`
        <${Card} className="border border-rose-200 dark:border-rose-900/40">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Backend not reachable</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            ${customersError}. Start the API at <span className="font-semibold">http://localhost:5000</span>.
          </div>
          <div className="mt-4">
            <${Button} variant="secondary" onClick=${loadCustomers} disabled=${loadingCustomers}>
              ${loadingCustomers ? "Retrying…" : "Retry"}
            </${Button}>
          </div>
        </${Card}>
      `
    : html`<${DashboardPage} customers=${customers} />`;

  if (path.startsWith("/customers")) {
    title = "Customers";
    subtitle = "Manage records, packages, and expiry";
    content = html`<${CustomersPage}
      customers=${customers}
      loading=${loadingCustomers}
      error=${customersError}
      onRefresh=${loadCustomers}
      onCreate=${async (payload) => {
        try {
          const created = await apiCreateCustomer(payload);
          setCustomers((prev) => [created, ...prev]);
          toast.success("Customer added", `${created?.name ?? "Customer"} saved.`);
        } catch (e) {
          toast.error("Create failed", e?.message ?? "Could not create customer");
          throw e;
        }
      }}
      onUpdate=${async (id, payload) => {
        try {
          const updated = await apiUpdateCustomer(id, payload);
          setCustomers((prev) => prev.map((x) => (x.id === id ? updated : x)));
          toast.success("Customer updated", `${updated?.name ?? "Customer"} saved.`);
        } catch (e) {
          toast.error("Update failed", e?.message ?? "Could not update customer");
          throw e;
        }
      }}
      onDelete=${async (id, name) => {
        try {
          await apiDeleteCustomer(id);
          setCustomers((prev) => prev.filter((x) => x.id !== id));
          toast.success("Deleted", `${name ?? "Customer"} removed.`);
        } catch (e) {
          toast.error("Delete failed", e?.message ?? "Could not delete customer");
          throw e;
        }
      }}
    />`;
  } else if (path.startsWith("/settings")) {
    title = "Settings";
    subtitle = "Appearance and demo options";
    content = html`<${SettingsPage} />`;
  }

  return html`
    <div>
      <${SidebarOverlay} open=${!sidebarCollapsed} onClose=${() => setSidebarCollapsed(true)} />
      <${Sidebar}
        path=${path}
        navigate=${navigate}
        collapsed=${sidebarCollapsed}
        setCollapsed=${setSidebarCollapsed}
      />

      <div className="md:pl-72">
        <${TopBar}
          title=${title}
          subtitle=${subtitle}
          onMenuClick=${() => setSidebarCollapsed(false)}
          right=${html`
            <div className="hidden sm:flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                ${auth.username}
              </span>
              <${Button} size="sm" variant="secondary" onClick=${logout}>Logout</${Button}>
            </div>
            <div className="sm:hidden">
              <${Button} size="sm" variant="secondary" onClick=${logout}>Logout</${Button}>
            </div>
          `}
        />

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6">
          ${content}
        </main>
      </div>
    </div>
  `;
}

export function App() {
  return html`
    <${ToastProvider}>
      <${AppInner} />
    </${ToastProvider}>
  `;
}

