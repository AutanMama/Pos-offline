import { CheckCircle2, Printer } from "lucide-react";
import { naira } from "../../lib/money";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import Receipt from "./Receipt";

export default function ReceiptDialog({ sale, fresh, onClose }) {
  return (
    <Dialog label="Receipt" onClose={onClose} className="w-full sm:w-auto">
      <div className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-panel sm:max-h-[calc(100dvh-3rem)] sm:w-[380px] sm:rounded-2xl">
        {fresh && (
          <div className="m-5 mb-0 flex items-center gap-3 rounded-lg bg-go-soft p-3">
            <CheckCircle2 size={22} className="shrink-0 text-go" aria-hidden />
            <p className="text-sm text-ink">
              <span className="block font-semibold">Sale complete</span>
              {sale.method === "Cash" && sale.change > 0 ? `Give ${naira(sale.change, { kobo: true })} change.` : `Paid by ${sale.method.toLowerCase()}.`}
            </p>
          </div>
        )}
        <div className="mx-5 mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl bg-sunk px-3 py-5">
          <div className="flex justify-center">
            <Receipt sale={sale} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-5">
          <Button onClick={() => window.print()}>
            <Printer size={18} aria-hidden /> Print
          </Button>
          <Button variant="go" onClick={onClose}>
            {fresh ? "New sale" : "Done"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
