// Tally's mark: four strokes crossed by a fifth, the way a count is kept by hand.
export default function BrandMark({ className = "size-9" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="9" className="fill-go" />
      <g className="stroke-on-go" strokeWidth="3" strokeLinecap="round">
        <path d="M12 11v18M17.5 11v18M23 11v18M28.5 11v18" />
        <path d="M9 25.5 31.5 14" />
      </g>
    </svg>
  );
}
