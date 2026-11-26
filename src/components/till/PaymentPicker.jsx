import { ArrowLeftRight, Banknote, CreditCard } from "lucide-react";
import { PAYMENT_METHODS } from "../../data/store";

const ICONS = { Cash: Banknote, Card: CreditCard, Transfer: ArrowLeftRight };

export default function PaymentPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-sunk p-1" role="radiogroup" aria-label="Payment method">
      {PAYMENT_METHODS.map((m) => {
        const Icon = ICONS[m];
        const active = value === m;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m)}
            className={`flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors ${
              active ? "bg-panel text-ink shadow-raised" : "text-muted hover:text-ink"
            }`}
          >
            <Icon size={17} aria-hidden /> {m}
          </button>
        );
      })}
    </div>
  );
}
