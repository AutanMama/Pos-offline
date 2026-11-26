import { useEffect, useRef } from "react";

export default function Dialog({ label, onClose, children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} aria-hidden />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} className={`animate-rise relative outline-none ${className}`}>
        {children}
      </div>
    </div>
  );
}
