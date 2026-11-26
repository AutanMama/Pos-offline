import { useCallback } from "react";
import { OPENING_STOCK } from "../data/products";
import { useStoredState } from "./useStoredState";

export function useInventory() {
  const [stock, setStock] = useStoredState("tally.stock", OPENING_STOCK);

  const deduct = useCallback(
    (lines) =>
      setStock((prev) => {
        const next = { ...prev };
        lines.forEach((l) => {
          next[l.id] = Math.max(0, (next[l.id] ?? 0) - l.qty);
        });
        return next;
      }),
    [setStock]
  );

  const receive = useCallback((id, qty) => setStock((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + qty })), [setStock]);

  return { stock, deduct, receive };
}
