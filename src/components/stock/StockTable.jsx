import { useState } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES, LOW_STOCK_AT } from "../../data/products";
import { CATEGORY_TONE } from "../../lib/categories";
import { naira } from "../../lib/money";
import { stockState } from "../../lib/stock";
import StockBadge from "../ui/StockBadge";

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
const BAR = { ok: "bg-go", low: "bg-low", out: "bg-out" };

function Receive({ product, onReceive }) {
  const [qty, setQty] = useState("");
  const n = Number(qty);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (n > 0) {
          onReceive(product, n);
          setQty("");
        }
      }}
      className="flex items-center justify-end gap-1.5"
    >
      <label>
        <span className="sr-only">Quantity of {product.name} received</span>
        <input
          type="number"
          min="1"
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Qty"
          className="figure h-9 w-20 rounded-md border border-line bg-panel px-2.5 text-ink placeholder:font-sans placeholder:text-muted focus:border-go focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={!(n > 0)}
        className="inline-flex h-9 items-center gap-1 rounded-md border border-line px-2.5 text-sm font-semibold text-ink hover:border-ink/40 disabled:text-muted"
      >
        <Plus size={15} aria-hidden /> Receive
      </button>
    </form>
  );
}

function Level({ count }) {
  const state = stockState(count);
  const pct = Math.min(100, (count / (LOW_STOCK_AT * 6)) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-sunk" aria-hidden>
        <span className={`block h-full ${BAR[state]}`} style={{ width: `${pct}%` }} />
      </span>
      <StockBadge count={count} long />
    </div>
  );
}

export default function StockTable({ products, stock, onReceive }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <table className="hidden w-full text-left md:table">
        <thead className="border-b border-line bg-sunk/70">
          <tr className="label text-muted">
            <th className="px-5 py-3 font-semibold">Product</th>
            <th className="px-5 py-3 font-semibold">Barcode</th>
            <th className="px-5 py-3 text-right font-semibold">Price</th>
            <th className="px-5 py-3 font-semibold">In stock</th>
            <th className="px-5 py-3 text-right font-semibold">Receive delivery</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-5 py-3">
                <span className="flex items-center gap-3">
                  <span className={`h-8 w-1.5 rounded-full ${CATEGORY_TONE[p.category].bar}`} aria-hidden />
                  <span>
                    <span className="block font-semibold text-ink">{p.name}</span>
                    <span className="text-sm text-muted">
                      {p.size} · {CATEGORY_LABEL[p.category]}
                    </span>
                  </span>
                </span>
              </td>
              <td className="figure px-5 py-3 text-muted">{p.barcode}</td>
              <td className="figure px-5 py-3 text-right text-ink">{naira(p.price)}</td>
              <td className="px-5 py-3">
                <Level count={stock[p.id] ?? 0} />
              </td>
              <td className="px-5 py-3">
                <Receive product={p} onReceive={onReceive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-line md:hidden">
        {products.map((p) => (
          <li key={p.id} className="space-y-3 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <span>
                <span className="block font-semibold text-ink">{p.name}</span>
                <span className="text-sm text-muted">
                  {p.size} · {naira(p.price)}
                </span>
              </span>
              <StockBadge count={stock[p.id] ?? 0} long />
            </div>
            <Receive product={p} onReceive={onReceive} />
          </li>
        ))}
      </ul>
    </div>
  );
}
