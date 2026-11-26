import { stockState } from "../../lib/stock";

const STYLES = {
  ok: "text-muted",
  low: "bg-low-soft text-low",
  out: "bg-out-soft text-out",
};

export default function StockBadge({ count, long = false }) {
  const state = stockState(count);
  const text = state === "out" ? "Out of stock" : state === "low" ? `Low · ${count} left` : `${count} ${long ? "in stock" : "left"}`;
  return <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap ${STYLES[state]}`}>{text}</span>;
}
