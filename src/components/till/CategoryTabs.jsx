import { CATEGORIES } from "../../data/products";
import { CATEGORY_TONE } from "../../lib/categories";

export default function CategoryTabs({ value, onChange, counts }) {
  const tabs = [{ id: "all", label: "All" }, ...CATEGORIES];
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Categories">
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
              active ? "border-ink bg-ink text-panel" : "border-line bg-panel text-ink hover:border-ink/40"
            }`}
          >
            {t.id !== "all" && <span className={`size-2.5 rounded-sm ${CATEGORY_TONE[t.id].bar}`} aria-hidden />}
            {t.label}
            <span className={`figure text-xs ${active ? "text-panel/70" : "text-muted"}`}>{counts[t.id] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
