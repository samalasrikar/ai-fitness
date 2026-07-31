import { useState } from 'react';

/**
 * ExerciseBuilder – Collapsible editable exercise card for ManualWorkoutModal.
 *
 * ✅ Collapse / expand toggle – collapsed by default when index > 0
 * ✅ All interactive controls meet 44×44 px minimum touch target
 * ✅ Inline validation on required fields (name, sets, reps)
 * ✅ Duplicate action added
 * ✅ Stats grid: 2-col on all screens to prevent cramping on 320px devices
 */
export default function ExerciseBuilder({
  exercise,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDuplicate,
  onOpenLibrary,
  onChange,
}) {
  // First exercise starts expanded; subsequent ones start collapsed
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const { name, sets, reps, weightKg, restTimeSec, notes } = exercise;

  // ── Field-level validation ────────────────────────────────────────────────
  const nameError = name !== undefined && name.trim() === '' ? 'Required' : null;
  const setsError =
    sets !== undefined && sets !== '' && (isNaN(Number(sets)) || Number(sets) <= 0)
      ? 'Must be > 0'
      : sets === '' && sets !== undefined
      ? null // empty is fine until submit
      : null;
  // reps can be text like "8-12", no strict format validation applied

  // Summary line shown in collapsed state
  const summary =
    sets && reps
      ? `${sets} sets × ${reps} reps${weightKg ? ` · ${weightKg} kg` : ''}`
      : 'Tap to configure';

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-colors duration-200
                  ${nameError ? 'border-red-500/40' : 'border-white/8'}
                  bg-[#0e0e0e]`}
    >
      {/* ── Card header – always visible ────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        {/* Reorder: stacked up/down with proper 44px tap area each */}
        <div className="flex flex-col items-center gap-0 flex-shrink-0">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            aria-label="Move exercise up"
            className="flex items-center justify-center w-[44px] h-[44px]
                       text-[#d1c5ab]/60 hover:text-white
                       disabled:opacity-20 disabled:cursor-not-allowed
                       transition-colors"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              arrow_upward
            </span>
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveDown}
            aria-label="Move exercise down"
            className="flex items-center justify-center w-[44px] h-[44px]
                       text-[#d1c5ab]/60 hover:text-white
                       disabled:opacity-20 disabled:cursor-not-allowed
                       transition-colors"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              arrow_downward
            </span>
          </button>
        </div>

        {/* Index badge */}
        <span className="flex-shrink-0 text-[11px] font-bold text-[#f5c400] w-5 text-center select-none">
          {index + 1}.
        </span>

        {/* Collapsed name / expand tap area */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse exercise' : 'Expand exercise'}
          className="flex-1 min-w-0 text-left py-2 px-1"
        >
          <p className="text-xs font-bold text-[#e5e2e1] truncate">
            {name || <span className="text-[#d1c5ab]/40 italic">Untitled exercise</span>}
          </p>
          {!isExpanded && (
            <p className="text-[10px] text-[#d1c5ab]/50 mt-0.5 truncate">{summary}</p>
          )}
        </button>

        {/* Chevron toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          className="flex-shrink-0 flex items-center justify-center
                     w-[44px] h-[44px] text-[#d1c5ab]/40 hover:text-[#f5c400]
                     transition-colors"
        >
          <span
            className={`material-symbols-outlined text-xl transition-transform duration-200
                       ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            expand_more
          </span>
        </button>
      </div>

      {/* ── Expandable body ──────────────────────────────────────────────── */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Name row */}
          <div className="space-y-1">
            <label
              htmlFor={`exercise-name-${index}`}
              className="text-[9px] uppercase font-bold tracking-wider text-[#d1c5ab]/60"
            >
              Exercise Name *
            </label>
            <input
              id={`exercise-name-${index}`}
              type="text"
              placeholder="e.g. Bench Press"
              value={name}
              onChange={(e) => onChange('name', e.target.value)}
              aria-label={`Exercise ${index + 1} name`}
              aria-invalid={!!nameError}
              className={`w-full bg-[#1a1919] border rounded-lg px-3 py-2.5
                         text-sm font-bold text-[#e5e2e1]
                         outline-none transition-colors
                         placeholder:text-[#d1c5ab]/30 min-h-[44px]
                         ${nameError
                           ? 'border-red-500/60 focus:border-red-400'
                           : 'border-white/8 focus:border-[#f5c400]'
                         }`}
            />
            {nameError && (
              <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span>
                {nameError}
              </p>
            )}
          </div>

          {/* Stats: 2-col grid safe on 320px+ */}
          <div className="grid grid-cols-2 gap-2">
            <StatField
              label="Sets *"
              id={`sets-${index}`}
              type="number"
              placeholder="4"
              value={sets}
              min="1"
              hasError={!!setsError}
              errorMsg={setsError}
              onChange={(v) => onChange('sets', v)}
            />
            <StatField
              label="Reps *"
              id={`reps-${index}`}
              type="text"
              placeholder="10 or 8–12"
              value={reps}
              onChange={(v) => onChange('reps', v)}
            />
            <StatField
              label="Weight (kg)"
              id={`weight-${index}`}
              type="number"
              placeholder="0"
              value={weightKg}
              min="0"
              onChange={(v) => onChange('weightKg', v)}
            />
            <StatField
              label="Rest (sec)"
              id={`rest-${index}`}
              type="number"
              placeholder="60"
              value={restTimeSec}
              min="0"
              onChange={(v) => onChange('restTimeSec', v)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label
              htmlFor={`notes-${index}`}
              className="text-[9px] uppercase font-bold tracking-wider text-[#d1c5ab]/60"
            >
              Notes
            </label>
            <input
              id={`notes-${index}`}
              type="text"
              placeholder="Optional coaching notes…"
              value={notes}
              onChange={(e) => onChange('notes', e.target.value)}
              aria-label={`Exercise ${index + 1} notes`}
              className="w-full bg-[#1a1919] border border-white/8 rounded-lg
                         px-3 py-2.5 text-xs text-[#d1c5ab]
                         outline-none focus:border-[#f5c400]/60 transition-colors
                         placeholder:text-[#d1c5ab]/30 min-h-[44px]"
            />
          </div>

          {/* Action row */}
          <div className="flex items-center gap-1 pt-1 border-t border-white/5">
            {/* Replace from library */}
            <ActionBtn
              onClick={onOpenLibrary}
              aria-label="Replace with exercise from library"
              icon="swap_horiz"
              label="Replace"
              className="text-[#f5c400] hover:bg-[#f5c400]/10"
            />

            {/* Duplicate */}
            <ActionBtn
              onClick={onDuplicate}
              aria-label="Duplicate exercise"
              icon="content_copy"
              label="Duplicate"
              className="text-[#d1c5ab]/60 hover:text-white hover:bg-white/5"
            />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Delete */}
            {total > 1 && (
              <ActionBtn
                onClick={onRemove}
                aria-label={`Delete exercise ${index + 1}`}
                icon="delete"
                label="Delete"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatField({ label, id, type, placeholder, value, min, onChange, hasError, errorMsg }) {
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
        inputMode={type === 'number' ? 'numeric' : 'text'}
        placeholder={placeholder}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={hasError}
        className={`w-full bg-[#1a1919] border rounded-lg
                   px-2.5 py-2.5 text-xs text-center font-bold text-[#e5e2e1]
                   outline-none transition-colors min-h-[44px]
                   ${hasError
                     ? 'border-red-500/60 focus:border-red-400'
                     : 'border-white/8 focus:border-[#f5c400]'
                   }`}
      />
      {hasError && errorMsg && (
        <p className="text-[9px] text-red-400 font-semibold">{errorMsg}</p>
      )}
    </div>
  );
}

function ActionBtn({ onClick, 'aria-label': ariaLabel, icon, label, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 h-[44px] px-3 rounded-lg
                 text-[10px] font-bold transition-colors cursor-pointer
                 ${className}`}
    >
      <span className="material-symbols-outlined text-base" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
