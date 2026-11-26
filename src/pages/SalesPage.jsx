import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Segmented from "../components/ui/Segmented";
import SalesSummary from "../components/sales/SalesSummary";
import SalesTable from "../components/sales/SalesTable";
import { useClock } from "../hooks/useClock";
import { formatDay, isSameDay } from "../lib/time";

export default function SalesPage({ sales, pendingCount, onOpen }) {
  const [range, setRange] = useState("today");
  const now = useClock();
  const shown = range === "today" ? sales.filter((s) => isSameDay(s.at, now)) : sales;

  return (
    <div className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="Sales" subtitle={range === "today" ? `Today, ${formatDay(now)}` : "Every sale on this till"}>
        <Segmented
          label="Range"
          value={range}
          onChange={setRange}
          options={[
            { id: "today", label: "Today" },
            { id: "all", label: "All" },
          ]}
        />
      </PageHeader>
      <SalesSummary sales={shown} pendingCount={pendingCount} />
      <h2 className="label mt-8 mb-3 text-muted">Receipts</h2>
      <SalesTable sales={shown} now={now} onOpen={onOpen} />
    </div>
  );
}
