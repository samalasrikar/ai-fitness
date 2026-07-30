/**
 * WorkoutCard – Responsive card for a single day's workout summary.
 *
 * ✅ Fills available width
 * ✅ Consistent padding & border radius
 * ✅ Never overflows horizontally
 */
export default function WorkoutCard({ workout, onPress }) {
  if (!workout) {
    return (
      <div
        className="w-full rounded-2xl border border-dashed border-white/10
                   bg-[#1a1919]/40 p-5 flex flex-col items-center justify-center gap-2
                   min-h-[100px] text-center"
      >
        <span
          className="material-symbols-outlined text-3xl text-[#d1c5ab]/30"
          aria-hidden="true"
        >
          add_circle
        </span>
        <p className="text-xs text-[#d1c5ab]/50 font-medium">
          No workout scheduled
        </p>
      </div>
    );
  }

  const { title, duration, exercises = [] } = workout;

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`Open ${title}`}
      className="w-full text-left rounded-2xl border border-white/8
                 bg-[#1a1919] hover:border-[#f5c400]/30 transition-all
                 active:scale-[0.99] cursor-pointer overflow-hidden"
    >
      {/* Accent bar */}
      <div className="h-1 w-full bg-[#f5c400] rounded-t-2xl" />

      <div className="p-4 space-y-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold text-[#e5e2e1] leading-snug min-w-0 flex-1">
            {title}
          </h3>
          {duration && (
            <span className="flex-shrink-0 text-[10px] font-bold text-[#f5c400]
                             bg-[#f5c400]/10 border border-[#f5c400]/20
                             px-2 py-0.5 rounded-full font-[JetBrains_Mono,monospace]">
              {duration}
            </span>
          )}
        </div>

        {/* Exercise count */}
        {exercises.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-sm text-[#d1c5ab]/60"
              aria-hidden="true"
            >
              list_alt
            </span>
            <span className="text-[11px] text-[#d1c5ab]/60 font-medium">
              {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Exercise name pills */}
        <div className="flex flex-wrap gap-1.5">
          {exercises.slice(0, 3).map((ex, i) => (
            <span
              key={i}
              className="text-[10px] font-medium text-[#d1c5ab] bg-[#262525]
                         border border-white/5 px-2 py-0.5 rounded-lg truncate
                         max-w-[120px]"
              title={ex.name}
            >
              {ex.name}
            </span>
          ))}
          {exercises.length > 3 && (
            <span className="text-[10px] font-medium text-[#f5c400]/70
                             bg-[#f5c400]/5 border border-[#f5c400]/10
                             px-2 py-0.5 rounded-lg">
              +{exercises.length - 3} more
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
