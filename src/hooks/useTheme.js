import { useEffect } from "react";
import { useStoredState } from "./useStoredState";

export function useTheme() {
  const [theme, setTheme] = useStoredState("tally.theme", "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}
