import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { products } from "../data/products";
import PageHeader from "../components/ui/PageHeader";
import Segmented from "../components/ui/Segmented";
import StockTable from "../components/stock/StockTable";
import { stockState } from "../lib/stock";

export default function StockPage({ stock, onReceive }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { low: 0, out: 0 };
    products.forEach((p) => {
      const s = stockState(stock[p.id] ?? 0);
      if (s !== "ok") c[s] += 1;
    });
    return c;
  }, [stock]);

  const q = query.trim().toLowerCase();
  const shown = products.filter(
    (p) => (filter === "all" || stockState(stock[p.id] ?? 0) === filter) && (!q || p.name.toLowerCase().includes(q) || p.barcode.includes(q))
  );

  return (
    <div className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="Stock" subtitle={`${products.length} products · ${counts.low} running low · ${counts.out} out of stock`}>
        <Segmented
          label="Show"
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", label: "All" },
            { id: "low", label: `Low (${counts.low})` },
            { id: "out", label: `Out (${counts.out})` },
          ]}
        />
      </PageHeader>
      <label className="relative mb-4 block max-w-md">
        <span className="sr-only">Search stock</span>
        <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or barcode"
          className="h-11 w-full rounded-lg border border-line bg-panel pr-3 pl-10 text-ink placeholder:text-muted focus:border-go focus:outline-none"
        />
      </label>
      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line px-6 py-14 text-center text-muted">Nothing to show here.</p>
      ) : (
        <StockTable products={shown} stock={stock} onReceive={onReceive} />
      )}
    </div>
  );
}
