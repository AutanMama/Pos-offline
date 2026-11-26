import { Moon, Sun } from "lucide-react";
import { store } from "../../data/store";
import { formatDay, formatTime } from "../../lib/time";
import { useClock } from "../../hooks/useClock";
import BrandMark from "./BrandMark";
import ConnectionBadge from "./ConnectionBadge";
import { VIEWS } from "./nav";

export default function TopBar({ view, onView, connection, theme, onToggleTheme }) {
  const now = useClock();

  return (
    <header className="border-b border-line bg-panel">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <BrandMark className="size-9 md:hidden" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{store.name}</p>
          <p className="truncate text-sm text-muted">
            {store.till} · Cashier {store.cashier}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden sm:inline-flex">
            <ConnectionBadge {...connection} />
          </span>
          <p className="hidden text-right lg:block">
            <span className="figure block text-lg leading-tight font-semibold text-ink">{formatTime(now)}</span>
            <span className="block text-xs text-muted">{formatDay(now)}</span>
          </p>
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid size-10 place-items-center rounded-lg text-muted hover:bg-sunk hover:text-ink md:hidden"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </div>

      <nav className="flex border-t border-line md:hidden" aria-label="Till sections">
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onView(id)}
            aria-current={view === id ? "page" : undefined}
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold ${
              view === id ? "border-go text-ink" : "border-transparent text-muted"
            }`}
          >
            <Icon size={18} aria-hidden /> {label}
          </button>
        ))}
      </nav>
      <div className="border-t border-line px-4 py-2 sm:hidden">
        <ConnectionBadge {...connection} />
      </div>
    </header>
  );
}
