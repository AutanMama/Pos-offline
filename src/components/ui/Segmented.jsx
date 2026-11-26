export default function Segmented({ options, value, onChange, label }) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-panel p-1" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors ${value === o.id ? "bg-ink text-panel" : "text-muted hover:text-ink"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
