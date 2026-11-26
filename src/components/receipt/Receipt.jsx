import { store } from "../../data/store";
import { naira } from "../../lib/money";
import { receiptNo } from "../../lib/sales";
import { formatDateTime } from "../../lib/time";

function Line({ left, right, strong = false }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-base font-semibold" : ""}`}>
      <span>{left}</span>
      <span className="shrink-0">{right}</span>
    </div>
  );
}

const Rule = () => <div className="my-3 border-t border-dashed border-paper-ink/40" aria-hidden />;

// A thermal till receipt. Shown on screen and the only thing that prints.
export default function Receipt({ sale }) {
  return (
    <div id="print-receipt" className="w-[320px] max-w-full drop-shadow-xl">
      <div className="bg-paper px-6 pt-7 pb-5 font-mono text-[13px] leading-relaxed text-paper-ink">
        <div className="text-center">
          <p className="font-sans text-xl font-bold tracking-tight">{store.name}</p>
          <p className="text-paper-muted">{store.address}</p>
          <p className="text-paper-muted">Tel {store.phone}</p>
        </div>
        <Rule />
        <Line left={`Receipt ${receiptNo(sale.number)}`} right={store.till} />
        <Line left={formatDateTime(sale.at)} right={`Cashier ${store.cashier}`} />
        <Rule />
        <ul className="space-y-1.5">
          {sale.lines.map((l) => (
            <li key={l.id}>
              <Line left={`${l.name} ${l.size}`} right={naira(l.price * l.qty, { kobo: true })} />
              <p className="text-paper-muted">
                {l.qty} × {naira(l.price)}
              </p>
            </li>
          ))}
        </ul>
        <Rule />
        <Line left="Subtotal" right={naira(sale.subtotal, { kobo: true })} />
        <Line left="VAT 7.5%" right={naira(sale.vat, { kobo: true })} />
        <div className="mt-1.5">
          <Line left="TOTAL" right={naira(sale.total, { kobo: true })} strong />
        </div>
        <Rule />
        <Line left={`Paid by ${sale.method.toLowerCase()}`} right={naira(sale.tendered, { kobo: true })} />
        {sale.method === "Cash" && <Line left="Change" right={naira(sale.change, { kobo: true })} />}
        <Rule />
        <p className="text-center">Thank you. Come again!</p>
        {!sale.synced && <p className="mt-2 text-center text-paper-muted">Saved offline · will sync</p>}
      </div>
      <div className="receipt-edge" aria-hidden />
    </div>
  );
}
