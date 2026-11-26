import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

const TONES = {
  info: { icon: Info, cls: "text-ink" },
  success: { icon: CheckCircle2, cls: "text-go" },
  warning: { icon: AlertTriangle, cls: "text-low" },
};

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
      {toasts.map((t) => {
        const tone = TONES[t.tone] ?? TONES.info;
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            className="animate-rise pointer-events-auto flex max-w-md items-center gap-3 rounded-lg border border-line bg-panel py-3 pr-2 pl-4 text-[15px] shadow-raised"
          >
            <Icon size={18} className={`shrink-0 ${tone.cls}`} aria-hidden />
            <span className="text-ink">{t.message}</span>
            <button type="button" onClick={() => onDismiss(t.id)} className="grid size-8 place-items-center rounded text-muted hover:bg-sunk" aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
