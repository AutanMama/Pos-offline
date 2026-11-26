import { ChevronRight, CloudOff } from "lucide-react";
import { naira } from "../../lib/money";
import { receiptNo } from "../../lib/sales";
import { formatDay, formatTime, isSameDay } from "../../lib/time";

function SyncState({ synced }) {
  return synced ? (
    <span className="text-sm text-muted">Synced</span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded bg-low-soft px-1.5 py-0.5 text-xs font-semibold text-low">
      <CloudOff size={13} aria-hidden /> Waiting
    </span>
  );
}

export default function SalesTable({ sales, now, onOpen }) {
  if (sales.length === 0) {
    return <p className="rounded-lg border border-dashed border-line px-6 py-14 text-center text-muted">No sales yet today.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <table className="hidden w-full text-left md:table">
        <thead className="border-b border-line bg-sunk/70">
          <tr className="label text-muted">
            <th className="px-5 py-3 font-semibold">Receipt</th>
            <th className="px-5 py-3 font-semibold">Time</th>
            <th className="px-5 py-3 font-semibold">Items</th>
            <th className="px-5 py-3 font-semibold">Paid by</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Total</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {sales.map((s) => (
            <tr key={s.id} onClick={() => onOpen(s)} className="cursor-pointer hover:bg-sunk/60">
              <td className="px-5 py-3.5">
                <button type="button" onClick={() => onOpen(s)} className="figure font-semibold text-ink hover:underline">
                  {receiptNo(s.number)}
                </button>
              </td>
              <td className="figure px-5 py-3.5 text-muted">
                {isSameDay(s.at, now) ? formatTime(s.at) : `${formatDay(s.at)}, ${formatTime(s.at)}`}
              </td>
              <td className="max-w-[280px] px-5 py-3.5">
                <span className="block truncate text-ink">{s.lines.map((l) => l.name).join(", ")}</span>
                <span className="text-sm text-muted">
                  {s.items} {s.items === 1 ? "item" : "items"}
                </span>
              </td>
              <td className="px-5 py-3.5 text-ink">{s.method}</td>
              <td className="px-5 py-3.5">
                <SyncState synced={s.synced} />
              </td>
              <td className="figure px-5 py-3.5 text-right font-semibold text-ink">{naira(s.total, { kobo: true })}</td>
              <td className="pr-4 text-muted">
                <ChevronRight size={18} aria-hidden />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-line md:hidden">
        {sales.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => onOpen(s)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <span className="min-w-0 flex-1">
                <span className="figure block font-semibold text-ink">
                  {receiptNo(s.number)} <span className="font-normal text-muted">· {formatTime(s.at)}</span>
                </span>
                <span className="block truncate text-sm text-muted">
                  {s.items} {s.items === 1 ? "item" : "items"} · {s.method}
                </span>
              </span>
              <span className="text-right">
                <span className="figure block font-semibold text-ink">{naira(s.total)}</span>
                <SyncState synced={s.synced} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
