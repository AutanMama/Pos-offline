import { useEffect, useMemo, useRef, useState } from "react";
import { products } from "../data/products";
import CategoryTabs from "../components/till/CategoryTabs";
import MobileOrderBar from "../components/till/MobileOrderBar";
import OrderPanel from "../components/till/OrderPanel";
import ProductGrid from "../components/till/ProductGrid";
import ScanBar from "../components/till/ScanBar";

export default function TillPage({ stock, order, payment, receipt, online, onAdd, onCharge }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const scanRef = useRef(null);

  // "/" jumps to the scan box from anywhere on the till.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        scanRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () => products.filter((p) => (category === "all" || p.category === category) && (!q || p.name.toLowerCase().includes(q) || p.barcode.includes(q))),
    [category, q]
  );
  const counts = useMemo(() => {
    const c = { all: products.length };
    products.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  function submitScan() {
    if (!q) return;
    const exact = products.find((p) => p.barcode === q);
    const match = exact ?? (shown.length === 1 ? shown[0] : null);
    if (match) {
      onAdd(match);
      setQuery("");
    } else {
      onAdd(null, exact === undefined && /^\d+$/.test(q) ? `No product has barcode ${q}.` : "Pick the item from the list.");
    }
  }

  async function charge() {
    await onCharge();
    setSheetOpen(false);
  }

  const panel = <OrderPanel order={order} receipt={receipt} payment={payment} online={online} onCharge={charge} onClose={() => setSheetOpen(false)} />;

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <section className="min-w-0 flex-1 overflow-y-auto px-4 pt-5 pb-28 md:px-6 md:pb-8" aria-label="Products">
        <ScanBar ref={scanRef} value={query} onChange={setQuery} onSubmit={submitScan} />
        <div className="mt-4 mb-5">
          <CategoryTabs value={category} onChange={setCategory} counts={counts} />
        </div>
        <ProductGrid products={shown} stock={stock} inOrder={order.qty} onAdd={(p) => onAdd(p)} query={query} />
      </section>

      <aside className="hidden w-[400px] shrink-0 border-l border-line md:block xl:w-[420px]" aria-label="Current sale">
        {panel}
      </aside>

      {sheetOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/45" onClick={() => setSheetOpen(false)} aria-hidden />
          <div className="animate-rise absolute inset-x-0 top-10 bottom-0 overflow-hidden rounded-t-2xl" role="dialog" aria-modal="true" aria-label="Current sale">
            {panel}
          </div>
        </div>
      )}
      {!sheetOpen && <MobileOrderBar totals={order.totals} onOpen={() => setSheetOpen(true)} />}
    </div>
  );
}
