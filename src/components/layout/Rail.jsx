import { Moon, Sun } from "lucide-react";
import BrandMark from "./BrandMark";
import { VIEWS } from "./nav";

export default function Rail({ view, onView, theme, onToggleTheme, alerts }) {
  return (
    <nav className="hidden w-[88px] shrink-0 flex-col items-center bg-rail py-4 md:flex" aria-label="Till sections">
      <BrandMark className="size-10" />
      <ul className="mt-8 flex flex-col gap-1.5">
        {VIEWS.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onView(id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex w-[68px] flex-col items-center gap-1 rounded-lg py-2.5 text-xs font-semibold transition-colors ${
                  active ? "bg-rail-active text-white" : "text-rail-ink hover:bg-rail-active/60 hover:text-white"
                }`}
              >
                {active && <span className="absolute top-2.5 bottom-2.5 -left-2.5 w-1 rounded-r bg-go" aria-hidden />}
                <Icon size={22} strokeWidth={1.8} aria-hidden />
                {label}
                {alerts[id] > 0 && (
                  <span className="figure absolute top-1 right-2 grid min-w-5 place-items-center rounded-full bg-low px-1 text-xs font-semibold text-panel">
                    {alerts[id]}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onToggleTheme}
        className="mt-auto grid size-11 place-items-center rounded-lg text-rail-ink hover:bg-rail-active hover:text-white"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
