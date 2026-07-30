/**
 * PlannerHeader – Responsive header for the Training Planner page.
 * Works from 320 px to 430 px. Both buttons maintain equal heights
 * and never wrap or clip.
 */
export default function PlannerHeader({ onManualClick, onAIClick }) {
  return (
    <header
      className="flex items-center justify-between gap-3 px-4 py-3"
      role="banner"
    >
      {/* Title */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="material-symbols-outlined text-[#f5c400] text-xl flex-shrink-0"
          aria-hidden="true"
        >
          fitness_center
        </span>
        <h1 className="text-base font-extrabold text-[#e5e2e1] truncate tracking-tight">
          Training Planner
        </h1>
      </div>

      {/* Action buttons – flex-shrink-0 prevents them from ever being clipped */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onManualClick}
          aria-label="Create workout manually"
          className="flex items-center gap-1.5 h-10 px-3 bg-[#201f1f] border border-white/10
                     text-[#e5e2e1] hover:text-white hover:border-[#f5c400]/40
                     rounded-xl text-xs font-bold uppercase tracking-wider
                     transition-all active:scale-95 cursor-pointer min-w-[44px]"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">
            edit_note
          </span>
          <span className="hidden xs:inline">Manual</span>
        </button>

        <button
          type="button"
          onClick={onAIClick}
          aria-label="Generate AI workout plan"
          className="flex items-center gap-1.5 h-10 px-3 bg-[#f5c400] text-black
                     rounded-xl text-xs font-bold uppercase tracking-wider
                     shadow-[0_0_15px_rgba(245,196,0,0.25)] hover:brightness-105
                     transition-all active:scale-95 cursor-pointer min-w-[44px]"
        >
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            auto_awesome
          </span>
          <span className="hidden xs:inline">AI Plan</span>
        </button>
      </div>
    </header>
  );
}
