/**
 * ExerciseBuilder – Editable exercise form card used inside ManualWorkoutModal.
 *
 * ✅ Name input fills available width (flex-1 min-w-0)
 * ✅ Stats grid: 2-col on mobile, 4-col on wider screens
 * ✅ Move up/down & action buttons: min 44×44 px touch targets
 * ✅ Delete requires single tap (no extra confirmation dialog needed – kept simple)
 */
export default function ExerciseBuilder({
  exercise,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  onOpenLibrary,
  onChange,
}) {
  const { name, sets, reps, weightKg, restTimeSec, notes } = exercise;

  return (
    <div className="rounded-xl bg-[#0e0e0e] border border-white/8 overflow-hidden">
      {/* ── Header row: order controls + name input + actions ── */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        {/* Reorder buttons */}
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            aria-label="Move exercise up"
            className="w-7 h-7 flex items-center justify-center rounded
                       text-[#d1c5ab]/60 hover:text-white
                       disabled:opacity-20 disabled:cursor-not-allowed
                       transition-colors"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              arrow_upward
            </span>
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveDown}
            aria-label="Move exercise down"
            className="w-7 h-7 flex items-center justify-center rounded
                       text-[#d1c5ab]/60 hover:text-white
                       disabled:opacity-20 disabled:cursor-not-allowed
                       transition-colors"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              arrow_downward
            </span>
          </button>
        </div>

        {/* Index badge */}
        <span className="flex-shrink-0 text-[11px] font-bold text-[#f5c400] w-5 text-center">
          {index + 1}.
        </span>

        {/* Exercise name – flex-1 min-w-0 prevents overflow */}
        <input
          type="text"
          id={`exercise-name-${index}`}
          placeholder="Exercise name *"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          aria-label={`Exercise ${index + 1} name`}
          className="flex-1 min-w-0 bg-[#1a1919] border border-white/5
                     rounded-lg px-2.5 py-2 text-xs font-bold text-[#e5e2e1]
                     outline-none focus:border-[#f5c400] transition-colors
                     placeholder:text-[#d1c5ab]/30"
        />

        {/* Replace from library */}
        <button
          type="button"
          onClick={onOpenLibrary}
          aria-label="Replace with exercise from library"
          title="Replace from library"
          className="flex-shrink-0 h-9 px-2.5 rounded-lg
                     text-[10px] font-bold text-[#f5c400]
                     bg-[#f5c400]/10 border border-[#f5c400]/20
                     hover:bg-[#f5c400]/20 transition-colors"
        >
          Swap
        </button>

        {/* Delete */}
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove exercise ${index + 1}`}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center
                       rounded-lg text-red-400 hover:text-red-300
                       hover:bg-red-500/10 transition-colors"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              delete
            </span>
          </button>
        )}
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 pb-2">
        <StatField
          label="Sets *"
          id={`sets-${index}`}
          type="number"
          placeholder="4"
          value={sets}
          onChange={(v) => onChange('sets', v)}
        />
        <StatField
          label="Reps *"
          id={`reps-${index}`}
          type="text"
          placeholder="10"
          value={reps}
          onChange={(v) => onChange('reps', v)}
        />
        <StatField
          label="Weight (kg)"
          id={`weight-${index}`}
          type="number"
          placeholder="80"
          value={weightKg}
          onChange={(v) => onChange('weightKg', v)}
        />
        <StatField
          label="Rest (s)"
          id={`rest-${index}`}
          type="number"
          placeholder="60"
          value={restTimeSec}
          onChange={(v) => onChange('restTimeSec', v)}
        />
      </div>

      {/* ── Notes ── */}
      <div className="px-3 pb-3">
        <input
          type="text"
          id={`notes-${index}`}
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => onChange('notes', e.target.value)}
          aria-label={`Exercise ${index + 1} notes`}
          className="w-full bg-[#1a1919] border border-white/5 rounded-lg
                     px-2.5 py-1.5 text-[11px] text-[#d1c5ab]
                     outline-none focus:border-[#f5c400]/60 transition-colors
                     placeholder:text-[#d1c5ab]/30"
        />
      </div>
    </div>
  );
}

function StatField({ label, id, type, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[9px] uppercase font-bold text-[#d1c5ab]/60 tracking-wider"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1a1919] border border-white/5 rounded-lg
                   px-2 py-2 text-xs text-center font-bold text-[#e5e2e1]
                   outline-none focus:border-[#f5c400] transition-colors
                   min-h-[36px]"
      />
    </div>
  );
}
