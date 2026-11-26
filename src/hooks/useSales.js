import { useCallback } from "react";
import { seedSales } from "../data/seedSales";
import { useStoredState } from "./useStoredState";

export function useSales() {
  const [sales, setSales] = useStoredState("tally.sales", () => seedSales());

  const nextNumber = (sales[0]?.number ?? 0) + 1;

  const record = useCallback((sale) => setSales((prev) => [sale, ...prev]), [setSales]);

  // Called when the sync queue uploads: marks those sales as on the server.
  const markSynced = useCallback((ids) => setSales((prev) => prev.map((s) => (ids.includes(s.id) ? { ...s, synced: true } : s))), [setSales]);

  return { sales, nextNumber, record, markSynced };
}
