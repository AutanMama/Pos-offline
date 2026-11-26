import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../lib/storage";

// useState that survives a reload by living in localStorage.
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => readJSON(key, typeof initial === "function" ? initial() : initial));

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
