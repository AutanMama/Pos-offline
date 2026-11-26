import { CloudOff, RefreshCw } from "lucide-react";

export default function ConnectionBadge({ online, pendingCount, syncing }) {
  if (!online) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg bg-low-soft px-3 py-1.5 text-sm font-semibold text-low">
        <CloudOff size={16} aria-hidden />
        Offline{pendingCount > 0 && ` · ${pendingCount} waiting`}
      </span>
    );
  }
  if (syncing) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg bg-sunk px-3 py-1.5 text-sm font-semibold text-ink">
        <RefreshCw size={15} className="animate-spin" aria-hidden />
        Syncing {pendingCount}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-medium text-muted">
      <span className="size-2 rounded-full bg-go" aria-hidden />
      Online · all synced
    </span>
  );
}
