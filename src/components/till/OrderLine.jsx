import { Minus, Plus, X } from "lucide-react";
import { naira } from "../../lib/money";
import { CATEGORY_TONE } from "../../lib/categories";

export default function OrderLine({ line, onChange, onRemove }) {
  return (
    <li className="animate-rise grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 border-b border-line py-3.5">
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-semibold text-ink">
          <span className={`size-2 shrink-0 rounded-sm ${CATEGORY_TONE[line.category].bar}`} aria-hidden />
          <span className="truncate">{line.name}</span>
        </p>
        <p className="figure mt-0.5 text-sm text-muted">
          {line.size} · {naira(line.price)}
        </p>
      </div>
      <p className="figure text-right font-semibold text-ink">{naira(line.price * line.qty)}</p>

      <div className="flex w-fit items-center rounded-lg border border-line">
        <button type="button" onClick={() => onChange(line.id, -1)} className="grid size-9 place-items-center text-muted hover:text-ink" aria-label={`One less ${line.name}`}>
          <Minus size={16} />
        </button>
        <span className="figure w-9 text-center font-semibold text-ink" aria-label="Quantity">
          {line.qty}
        </span>
        <button type="button" onClick={() => onChange(line.id, 1)} className="grid size-9 place-items-center text-muted hover:text-ink" aria-label={`One more ${line.name}`}>
          <Plus size={16} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onRemove(line.id)}
        className="justify-self-end rounded-lg p-2 text-muted hover:bg-out-soft hover:text-out"
        aria-label={`Remove ${line.name}`}
      >
        <X size={17} />
      </button>
    </li>
  );
}
