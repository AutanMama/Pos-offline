import { products } from "./products";
import { totalsFor } from "../lib/sales";
import { PAYMENT_METHODS, CASH_NOTES } from "./store";

// A believable morning of sales so the Sales page isn't empty on first visit.
// A small seeded generator keeps it the same on every first load.
function generator(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function seedSales(now = Date.now()) {
  const rand = generator(42);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const sales = [];
  let number = 120;
  const start = now - 6 * 60 * 60 * 1000;

  for (let i = 0; i < 22; i++) {
    const at = start + Math.floor((i / 22) * 6 * 60 * 60 * 1000 + rand() * 600000);
    const lines = [];
    const count = 1 + Math.floor(rand() * 4);
    for (let j = 0; j < count; j++) {
      const p = pick(products);
      if (lines.some((l) => l.id === p.id)) continue;
      lines.push({ id: p.id, name: p.name, size: p.size, price: p.price, qty: 1 + Math.floor(rand() * 3) });
    }
    const totals = totalsFor(lines);
    const method = rand() < 0.45 ? "Transfer" : pick(PAYMENT_METHODS);
    const tendered = method === "Cash" ? CASH_NOTES.find((n) => n >= totals.total) ?? Math.ceil(totals.total / 1000) * 1000 : totals.total;
    number += 1;
    sales.push({
      id: `seed-${number}`,
      number,
      at: new Date(at).toISOString(),
      lines,
      ...totals,
      method,
      tendered,
      change: Math.max(0, tendered - totals.total),
      synced: true,
    });
  }
  return sales.reverse();
}
