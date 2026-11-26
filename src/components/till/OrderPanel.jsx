import { CloudOff, ScanBarcode, X } from "lucide-react";
import { naira } from "../../lib/money";
import Button from "../ui/Button";
import CashTender from "./CashTender";
import OrderLine from "./OrderLine";
import PaymentPicker from "./PaymentPicker";

function Row({ label, value, strong = false }) {
  return (
    <div className={`flex items-baseline justify-between ${strong ? "text-ink" : "text-muted"}`}>
      <span className={strong ? "text-lg font-semibold" : "text-[15px]"}>{label}</span>
      <span className={`figure ${strong ? "text-3xl font-semibold" : "text-[15px]"}`}>{value}</span>
    </div>
  );
}

export default function OrderPanel({ order, receipt, payment, online, onCharge, onClose }) {
  const { lines, totals, change, remove, clear } = order;
  const empty = lines.length === 0;
  const short = payment.method === "Cash" && payment.tendered < totals.total;

  return (
    <div className="flex h-full flex-col bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Current sale</h2>
          <p className="figure text-sm text-muted">
            {receipt} · {totals.items} {totals.items === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!empty && (
            <Button variant="danger" size="sm" onClick={clear}>
              Clear
            </Button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-sunk md:hidden" aria-label="Close sale">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-sunk text-muted">
              <ScanBarcode size={26} aria-hidden />
            </span>
            <p className="mt-4 font-semibold text-ink">No items yet</p>
            <p className="mt-1 max-w-[16rem] text-sm text-muted">Scan a barcode or tap a product to start the sale.</p>
          </div>
        ) : (
          <ul>
            {lines.map((l) => (
              <OrderLine key={l.id} line={l} onChange={change} onRemove={remove} />
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4 border-t border-line bg-sunk/60 px-5 py-5">
        <div className="space-y-1.5">
          <Row label="Subtotal" value={naira(totals.subtotal, { kobo: true })} />
          <Row label="VAT 7.5%" value={naira(totals.vat, { kobo: true })} />
          <div className="pt-1.5">
            <Row label="Total" value={naira(totals.total, { kobo: true })} strong />
          </div>
        </div>

        <PaymentPicker value={payment.method} onChange={payment.setMethod} />
        {payment.method === "Cash" && !empty && <CashTender total={totals.total} tendered={payment.tendered} onTendered={payment.setTendered} />}

        <Button variant="go" size="lg" className="w-full" disabled={empty || short} onClick={onCharge}>
          {empty ? "Charge" : `Charge ${naira(totals.total, { kobo: true })}`}
        </Button>
        {!online && (
          <p className="flex items-center gap-2 text-sm text-low">
            <CloudOff size={15} aria-hidden /> Offline. The sale saves here and syncs later.
          </p>
        )}
      </div>
    </div>
  );
}
