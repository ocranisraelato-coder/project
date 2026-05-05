import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";

import { App } from "./ui/App.js";
import { ensureThemeApplied } from "./ui/theme.js";

const html = htm.bind(React.createElement);

ensureThemeApplied();

createRoot(document.getElementById("root")).render(html`<${App} />`);

