import { naira } from "../../lib/money";
import Button from "../ui/Button";

export default function MobileOrderBar({ totals, onOpen }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-panel px-4 py-3 shadow-raised md:hidden">
      <div>
        <p className="text-sm text-muted">
          {totals.items} {totals.items === 1 ? "item" : "items"}
        </p>
        <p className="figure text-xl font-semibold text-ink">{naira(totals.total, { kobo: true })}</p>
      </div>
      <Button variant="go" onClick={onOpen}>
        Review sale
      </Button>
    </div>
  );
}
