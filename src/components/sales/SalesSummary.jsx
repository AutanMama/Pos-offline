import { PAYMENT_METHODS } from "../../data/store";
import { naira } from "../../lib/money";

function Stat({ label, value, note }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <p className="label text-muted">{label}</p>
      <p className="figure mt-2 text-2xl font-semibold text-ink md:text-[28px]">{value}</p>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    </div>
  );
}

const BAR = { Cash: "bg-staples", Card: "bg-drinks", Transfer: "bg-go" };

export default function SalesSummary({ sales, pendingCount }) {
  const takings = sales.reduce((n, s) => n + s.total, 0);
  const items = sales.reduce((n, s) => n + s.items, 0);
  const byMethod = PAYMENT_METHODS.map((m) => ({ method: m, amount: sales.filter((s) => s.method === m).reduce((n, s) => n + s.total, 0) }));

  return (
    <div className="grid gap-3 lg:grid-cols-[repeat(3,1fr)_1.4fr]">
      <Stat label="Takings" value={naira(takings)} note={`${items} items sold`} />
      <Stat label="Sales" value={sales.length} note={pendingCount > 0 ? `${pendingCount} waiting to sync` : "All synced"} />
      <Stat label="Average sale" value={naira(sales.length ? takings / sales.length : 0)} />
      <div className="rounded-lg border border-line bg-panel p-5">
        <p className="label text-muted">How customers paid</p>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-sunk" aria-hidden>
          {byMethod.map((m) => (
            <span key={m.method} className={BAR[m.method]} style={{ width: `${takings ? (m.amount / takings) * 100 : 0}%` }} />
          ))}
        </div>
        <ul className="mt-3 space-y-1">
          {byMethod.map((m) => (
            <li key={m.method} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink">
                <span className={`size-2.5 rounded-sm ${BAR[m.method]}`} aria-hidden /> {m.method}
              </span>
              <span className="figure text-muted">
                {naira(m.amount)} · {takings ? Math.round((m.amount / takings) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
