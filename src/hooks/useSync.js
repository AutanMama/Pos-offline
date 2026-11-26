import { useEffect } from "react";

const UPLOAD_DELAY = 2500;

// Sales made offline wait here. Once the connection is back they upload
// (simulated, since the demo has no server) and are marked as synced.
export function useSync({ online, sales, markSynced }) {
  const pending = sales.filter((s) => !s.synced);
  const pendingIds = pending.map((s) => s.id).join(",");

  useEffect(() => {
    if (!online || !pendingIds) return;
    const timer = setTimeout(() => markSynced(pendingIds.split(",")), UPLOAD_DELAY);
    return () => clearTimeout(timer);
  }, [online, pendingIds, markSynced]);

  return { pendingCount: pending.length, syncing: online && pending.length > 0 };
}
