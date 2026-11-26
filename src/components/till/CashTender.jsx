import { cashOptions } from "../../data/store";
import { naira } from "../../lib/money";

// Cash only: what the customer handed over, and the change to give back.
export default function CashTender({ total, tendered, onTendered }) {
  const options = [total, ...cashOptions(total)];
  const change = tendered - total;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-1.5">
        {options.map((amount, i) => (
          <button
            key={amount}
            type="button"
            onClick={() => onTendered(amount)}
            aria-pressed={tendered === amount}
            className={`figure rounded-md border px-2.5 py-1.5 text-sm font-semibold transition-colors ${
              tendered === amount ? "border-go bg-go-soft text-ink" : "border-line bg-panel text-ink hover:border-ink/40"
            }`}
          >
            {i === 0 ? "Exact" : naira(amount)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <span className="sr-only">Cash received</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={tendered || ""}
            onChange={(e) => onTendered(Number(e.target.value))}
            placeholder="Cash received"
            className="figure h-11 w-full rounded-lg border border-line bg-panel px-3 text-ink placeholder:font-sans placeholder:text-muted focus:border-go focus:outline-none"
          />
        </label>
        <p className="text-right text-sm">
          <span className="block text-muted">{change >= 0 ? "Change" : "Short by"}</span>
          <span className={`figure block text-lg font-semibold ${change >= 0 ? "text-go" : "text-out"}`}>{naira(Math.abs(change), { kobo: true })}</span>
        </p>
      </div>
    </div>
  );
}
