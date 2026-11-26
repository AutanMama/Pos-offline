import { forwardRef } from "react";
import { ScanBarcode } from "lucide-react";

// One box for both: a scanner types the barcode and presses Enter, a person types a name.
const ScanBar = forwardRef(function ScanBar({ value, onChange, onSubmit }, ref) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="relative"
      role="search"
    >
      <ScanBarcode size={22} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Scan or search products"
        aria-label="Scan a barcode or search by name"
        autoComplete="off"
        className="h-14 w-full rounded-lg border border-line bg-panel pr-16 pl-13 text-lg text-ink placeholder:text-muted focus:border-go focus:outline-none"
      />
      <kbd className="figure absolute top-1/2 right-4 hidden -translate-y-1/2 rounded border border-line px-2 py-0.5 text-xs text-muted sm:block">/</kbd>
    </form>
  );
});

export default ScanBar;
