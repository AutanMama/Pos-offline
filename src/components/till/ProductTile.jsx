import { naira } from "../../lib/money";
import { CATEGORY_TONE } from "../../lib/categories";
import { stockState } from "../../lib/stock";
import StockBadge from "../ui/StockBadge";

export default function ProductTile({ product, stock, inOrder, onAdd }) {
  const out = stockState(stock) === "out";
  const tone = CATEGORY_TONE[product.category];

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      disabled={out}
      aria-label={`${product.name}, ${product.size}, ${naira(product.price)}${out ? ", out of stock" : ""}`}
      className="group relative flex min-h-[132px] flex-col overflow-hidden rounded-lg border border-line bg-panel p-3.5 pl-5 text-left transition hover:border-ink/40 hover:shadow-raised active:scale-[0.98] disabled:opacity-55 disabled:hover:border-line disabled:hover:shadow-none"
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${tone.bar}`} aria-hidden />
      {inOrder > 0 && (
        <span className="figure absolute top-2.5 right-2.5 grid min-w-7 place-items-center rounded-full bg-go px-1.5 py-0.5 text-sm font-semibold text-on-go" aria-label={`${inOrder} in order`}>
          {inOrder}
        </span>
      )}
      <span className="pr-8 leading-snug font-semibold text-ink">{product.name}</span>
      <span className="mt-0.5 text-sm text-muted">{product.size}</span>
      <span className="mt-auto flex items-end justify-between gap-2 pt-3">
        <span className="figure text-lg font-semibold text-ink">{naira(product.price)}</span>
        <StockBadge count={stock} />
      </span>
    </button>
  );
}
