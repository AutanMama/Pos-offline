import { SearchX } from "lucide-react";
import ProductTile from "./ProductTile";

export default function ProductGrid({ products, stock, inOrder, onAdd, query }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-dashed border-line px-6 py-16 text-center">
        <SearchX size={28} className="text-muted" aria-hidden />
        <p className="mt-3 font-semibold text-ink">Nothing matches “{query}”</p>
        <p className="mt-1 text-sm text-muted">Check the spelling, or scan the item’s barcode.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductTile key={p.id} product={p} stock={stock[p.id] ?? 0} inOrder={inOrder[p.id] ?? 0} onAdd={onAdd} />
      ))}
    </div>
  );
}
