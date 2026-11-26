const VARIANTS = {
  go: "bg-go text-on-go hover:bg-go-hover disabled:bg-sunk disabled:text-muted",
  neutral: "border border-line bg-panel text-ink hover:border-ink/40 disabled:text-muted",
  ghost: "text-muted hover:bg-sunk hover:text-ink",
  danger: "text-out hover:bg-out-soft",
};

const SIZES = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-[15px]",
  lg: "h-14 px-5 text-lg",
};

export default function Button({ variant = "neutral", size = "md", className = "", children, ...rest }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
