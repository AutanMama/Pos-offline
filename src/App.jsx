import { useCallback, useState } from "react";
import Rail from "./components/layout/Rail";
import TopBar from "./components/layout/TopBar";
import ReceiptDialog from "./components/receipt/ReceiptDialog";
import Toasts from "./components/ui/Toasts";
import { stockState } from "./lib/stock";
import { products } from "./data/products";
import { useOnline } from "./hooks/useConnection";
import { useInventory } from "./hooks/useInventory";
import { useOrder } from "./hooks/useOrder";
import { useSales } from "./hooks/useSales";
import { useSync } from "./hooks/useSync";
import { useTheme } from "./hooks/useTheme";
import { useToasts } from "./hooks/useToasts";
import { receiptNo } from "./lib/sales";
import SalesPage from "./pages/SalesPage";
import StockPage from "./pages/StockPage";
import TillPage from "./pages/TillPage";

export default function App() {
  const { theme, toggle } = useTheme();
  const online = useOnline();
  const { stock, deduct, receive } = useInventory();
  const { sales, nextNumber, record, markSynced } = useSales();
  const sync = useSync({ online, sales, markSynced });
  const order = useOrder(stock);
  const { toasts, notify, dismiss } = useToasts();

  const [view, setView] = useState("till");
  const [method, setMethod] = useState("Cash");
  const [tendered, setTendered] = useState(0);
  const [receipt, setReceipt] = useState(null);

  const addToOrder = useCallback(
    (product, message) => {
      if (!product) return notify(message, "warning");
      const problem = order.add(product);
      if (problem) notify(problem, "warning");
    },
    [order, notify]
  );

  const charge = () => {
    const { lines, totals } = order;
    const paid = method === "Cash" ? tendered : totals.total;
    const sale = {
      id: `${Date.now()}`,
      number: nextNumber,
      at: new Date().toISOString(),
      lines: lines.map(({ id, name, size, price, qty }) => ({ id, name, size, price, qty })),
      ...totals,
      method,
      tendered: paid,
      change: Math.max(0, paid - totals.total),
      synced: false,
    };
    record(sale);
    deduct(lines);
    order.clear();
    setTendered(0);
    setReceipt({ sale, fresh: true });
    if (!online) notify("Saved on this till. It will sync when you’re back online.", "warning");
  };

  const receiveStock = (product, qty) => {
    receive(product.id, qty);
    notify(`Received ${qty} × ${product.name}.`, "success");
  };

  const stockAlerts = products.filter((p) => stockState(stock[p.id] ?? 0) !== "ok").length;
  const connection = { online, pendingCount: sync.pendingCount, syncing: sync.syncing };

  return (
    <div className="flex h-dvh overflow-hidden">
      <Rail view={view} onView={setView} theme={theme} onToggleTheme={toggle} alerts={{ sales: sync.pendingCount, stock: stockAlerts }} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar view={view} onView={setView} connection={connection} theme={theme} onToggleTheme={toggle} />
        <main className="flex min-h-0 flex-1">
          {view === "till" && (
            <TillPage
              stock={stock}
              order={order}
              payment={{ method, setMethod, tendered, setTendered }}
              receipt={receiptNo(nextNumber)}
              online={online}
              onAdd={addToOrder}
              onCharge={charge}
            />
          )}
          {view === "sales" && <SalesPage sales={sales} pendingCount={sync.pendingCount} onOpen={(sale) => setReceipt({ sale, fresh: false })} />}
          {view === "stock" && <StockPage stock={stock} onReceive={receiveStock} />}
        </main>
      </div>

      {receipt && <ReceiptDialog sale={receipt.sale} fresh={receipt.fresh} onClose={() => setReceipt(null)} />}
      <Toasts toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
