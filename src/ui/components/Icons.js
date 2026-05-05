import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(React.createElement);

export function Icon({ children, className = "" }) {
  return html`<span className=${className} aria-hidden="true">${children}</span>`;
}

export function LogoMark({ className = "h-8 w-8" }) {
  return html`
    <svg className=${className} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="g" x1="10" y1="10" x2="54" y2="54">
          <stop stop-color="#6366F1" />
          <stop offset="1" stop-color="#2563EB" />
        </linearGradient>
      </defs>
      <path
        d="M32 6c14.36 0 26 11.64 26 26S46.36 58 32 58 6 46.36 6 32 17.64 6 32 6Z"
        fill="url(#g)"
        opacity="0.95"
      />
      <path
        d="M20 34.5c0-5.8 4.7-10.5 10.5-10.5H44v6H30.5a4.5 4.5 0 0 0 0 9H44v6H30.5C24.7 45 20 40.3 20 34.5Z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  `;
}

export function SunIcon({ className = "h-5 w-5" }) {
  return html`<svg className=${className} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
      stroke="currentColor"
      stroke-width="2"
    />
    <path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>`;
}

export function MoonIcon({ className = "h-5 w-5" }) {
  return html`<svg className=${className} viewBox="0 0 24 24" fill="none">
    <path
      d="M21 13.2A7.5 7.5 0 0 1 10.8 3 9 9 0 1 0 21 13.2Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
  </svg>`;
}

export function SearchIcon({ className = "h-5 w-5" }) {
  return html`<svg className=${className} viewBox="0 0 24 24" fill="none">
    <path
      d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
      stroke="currentColor"
      stroke-width="2"
    />
    <path
      d="m21 21-4.3-4.3"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>`;
}

export function PlusIcon({ className = "h-5 w-5" }) {
  return html`<svg className=${className} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>`;
}

export function DownloadIcon({ className = "h-5 w-5" }) {
  return html`<svg className=${className} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3v10m0 0 4-4m-4 4-4-4"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 17v3h16v-3"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>`;
}

export function Bars3Icon({ className = "h-5 w-5" }) {
  return html`<svg className=${className} viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>`;
}

export function XIcon({ className = "h-5 w-5" }) {
  return html`<svg className=${className} viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>`;
}

