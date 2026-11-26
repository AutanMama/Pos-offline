import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./styles/index.css";
import App from "./App.jsx";

// Apply a saved dark theme before the first paint.
try {
  if (JSON.parse(localStorage.getItem("tally.theme")) === "dark") document.documentElement.classList.add("dark");
} catch {
  // No saved theme yet.
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
