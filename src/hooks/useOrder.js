import { useCallback, useMemo, useState } from "react";
import { productById } from "../data/products";
import { totalsFor } from "../lib/sales";

// The order on the counter. Returns a message when stock runs out instead
// of silently failing, so the till can tell the cashier.
export function useOrder(stock) {
  const [qty, setQty] = useState({});

  const lines = useMemo(
    () =>
      Object.entries(qty).map(([id, n]) => {
        const p = productById[id];
        return { id, name: p.name, size: p.size, price: p.price, category: p.category, qty: n };
      }),
    [qty]
  );

  const totals = useMemo(() => totalsFor(lines), [lines]);

  const add = useCallback(
    (product) => {
      const have = qty[product.id] ?? 0;
      const left = stock[product.id] ?? 0;
      if (have >= left) return left === 0 ? `${product.name} is out of stock.` : `Only ${left} ${product.name} in stock.`;
      setQty((q) => ({ ...q, [product.id]: have + 1 }));
      return null;
    },
    [qty, stock]
  );

  const change = useCallback(
    (id, delta) => {
      const next = (qty[id] ?? 0) + delta;
      if (next > (stock[id] ?? 0)) return `Only ${stock[id] ?? 0} ${productById[id].name} in stock.`;
      setQty((q) => {
        const copy = { ...q };
        if (next <= 0) delete copy[id];
        else copy[id] = next;
        return copy;
      });
      return null;
    },
    [qty, stock]
  );

  const remove = useCallback(
    (id) =>
      setQty((q) => {
        const copy = { ...q };
        delete copy[id];
        return copy;
      }),
    []
  );
  const clear = useCallback(() => setQty({}), []);

  return { lines, totals, qty, add, change, remove, clear };
}
