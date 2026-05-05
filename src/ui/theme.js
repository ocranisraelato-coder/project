const THEME_KEY = "subtrack.theme"; // 'light' | 'dark' | 'system'

export function getStoredThemePreference() {
  const v = localStorage.getItem(THEME_KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

export function setStoredThemePreference(pref) {
  localStorage.setItem(THEME_KEY, pref);
}

export function isSystemDark() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ensureThemeApplied() {
  const pref = getStoredThemePreference();
  const shouldDark = pref === "dark" || (pref === "system" && isSystemDark());
  document.documentElement.classList.toggle("dark", shouldDark);
}

export function toggleThemeQuick() {
  const pref = getStoredThemePreference();
  const next = pref === "dark" ? "light" : "dark";
  setStoredThemePreference(next);
  ensureThemeApplied();
  return next;
}

