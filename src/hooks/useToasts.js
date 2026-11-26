import { useCallback, useRef, useState } from "react";

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const seq = useRef(0);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const notify = useCallback(
    (message, tone = "info") => {
      const id = ++seq.current;
      setToasts((t) => [...t.slice(-2), { id, message, tone }]);
      setTimeout(() => dismiss(id), 3200);
    },
    [dismiss]
  );

  return { toasts, notify, dismiss };
}
