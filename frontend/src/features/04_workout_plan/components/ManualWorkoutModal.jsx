import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseLibraryModal from '../../05_exercise_library/components/ExerciseLibraryModal';
import ExerciseBuilder from './ExerciseBuilder';
import { useWorkoutPlanner } from '../hooks/useWorkoutPlanner';

/**
 * ManualWorkoutModal – Production-quality mobile-first bottom-sheet modal.
 *
 * Layout contract
 * ───────────────
 *   ┌─────────────────────────────┐  ← fixed (flex-shrink-0)
 *   │ Header: title + close       │
 *   ├─────────────────────────────┤
 *   │ Body: scrollable only here  │  ← flex-1 overflow-y-auto
 *   │  • Workout details form     │
 *   │  • Exercise list            │
 *   │  • Add-exercise controls    │
 *   ├─────────────────────────────┤
 *   │ Footer: Cancel + Save       │  ← fixed (flex-shrink-0)
 *   └─────────────────────────────┘
 *
 * UX guarantees
 * ─────────────
 * ✅ max-height: 92dvh – never overflows viewport
 * ✅ Body scroll lock on open; scroll position restored on close
 * ✅ visualViewport resize listener: keeps footer above software keyboard
 * ✅ ESC closes modal (desktop); backdrop tap also closes
 * ✅ Focus trap: Tab/Shift+Tab cycles within modal only
 * ✅ ARIA role="dialog" + aria-modal + aria-labelledby
 * ✅ FloatingAIButton hidden via isModalOpen prop in parent
 * ✅ Save disabled until form is valid; shows spinner while saving
 * ✅ Inline error banner (no alert dialogs)
 * ✅ z-[60] backdrop covers BottomNav
 */
export default function ManualWorkoutModal({ isOpen, onClose, onSave }) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [replacingIdx, setReplacingIdx] = useState(null);

  // Refs for focus trap
  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);
  const bodyRef = useRef(null);

  const formId = 'manual-workout-form';

  const {
    title,
    setTitle,
    duration,
    setDuration,
    error,
    isSaving,
    isValid,
    exercises,
    handleAddExercise,
    handleRemoveExercise,
    handleDuplicateExercise,
    handleMoveUp,
    handleMoveDown,
    handleExerciseChange,
    handleSelectFromLibrary,
    handleSubmit,
  } = useWorkoutPlanner({ onSave, onClose });

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      const savedTop = document.body.style.top;
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, -parseInt(savedTop || '0', 10));
    };
  }, [isOpen]);

  // ── visualViewport resize – keeps modal above software keyboard ───────────
  useEffect(() => {
    if (!isOpen) return;

    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      if (modalRef.current) {
        // Shift modal up by the difference between layout and visual viewport
        const offsetY = window.innerHeight - vv.height - vv.offsetTop;
        modalRef.current.style.bottom = `${Math.max(0, offsetY)}px`;
      }
    };

    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);

    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
      if (modalRef.current) modalRef.current.style.bottom = '';
    };
  }, [isOpen]);

  // ── ESC key ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape' && !isLibraryOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, isLibraryOpen, onClose]);

  // ── Focus trap ────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== 'Tab' || isLibraryOpen) return;
      const modal = modalRef.current;
      if (!modal) return;

      const focusable = Array.from(
        modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.closest('[aria-hidden="true"]'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isLibraryOpen]
  );

  // ── Auto-focus first element on open ─────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => firstFocusRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Library helpers ───────────────────────────────────────────────────────
  const openLibraryForNew = () => {
    setReplacingIdx(null);
    setIsLibraryOpen(true);
  };

  const openLibraryForReplace = (idx) => {
    setReplacingIdx(idx);
    setIsLibraryOpen(true);
  };

  const onLibrarySelect = (selectedEx) => {
    handleSelectFromLibrary(selectedEx, replacingIdx);
    setReplacingIdx(null);
  };

  // ── Title validation (shown when user has typed then cleared) ─────────────
  const [titleTouched, setTitleTouched] = useState(false);
  const showTitleError = titleTouched && title.trim() === '';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* ── Backdrop ────────────────────────────────────────────── */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* ── Modal sheet ─────────────────────────────────────────── */}
            <motion.div
              key="modal-wrapper"
              className="fixed inset-0 z-[61]
                         flex items-center justify-center
                         pointer-events-none p-2.5 sm:p-4"
            >
              <motion.div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="manual-modal-title"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                onKeyDown={handleKeyDown}
                className="pointer-events-auto
                           w-[min(95vw,420px)] sm:w-[min(90vw,700px)]
                           flex flex-col
                           max-h-[90dvh]
                           bg-[#1a1919] border border-[#f5c400]/20
                           rounded-2xl
                           shadow-2xl text-[#e5e2e1] overflow-hidden
                           relative my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle (mobile visual cue) */}
                <div
                  className="absolute top-2.5 left-1/2 -translate-x-1/2
                              w-10 h-1 bg-white/10 rounded-full sm:hidden"
                  aria-hidden="true"
                />

                {/* ── Fixed Header ─────────────────────────────────────── */}
                <div
                  className="flex-shrink-0 flex items-center justify-between
                              px-4 sm:px-5 py-3 sm:py-4 border-b border-white/5"
                >
                  <h2
                    id="manual-modal-title"
                    className="text-base font-bold text-[#f5c400] tracking-tight"
                  >
                    Create Workout Plan
                  </h2>
                  <button
                    type="button"
                    ref={firstFocusRef}
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="w-[44px] h-[44px] flex items-center justify-center
                               rounded-xl text-[#d1c5ab]/60 hover:text-white
                               hover:bg-white/5 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">
                      close
                    </span>
                  </button>
                </div>

                {/* ── Scrollable Body ───────────────────────────────────── */}
                <div
                  ref={bodyRef}
                  className="flex-1 overflow-y-auto overscroll-contain no-scrollbar"
                >
                  <form id={formId} onSubmit={handleSubmit} noValidate>
                    <div className="px-4 py-4 space-y-5">

                      {/* Error banner */}
                      {error && (
                        <div
                          role="alert"
                          aria-live="assertive"
                          className="flex items-start gap-2 p-3
                                     bg-red-500/10 border border-red-500/20
                                     rounded-xl text-xs text-red-400 font-semibold"
                        >
                          <span
                            className="material-symbols-outlined text-sm flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          >
                            error
                          </span>
                          {error}
                        </div>
                      )}

                      {/* ── Workout Details ─────────────────────────────── */}
                      <section aria-label="Workout details" className="space-y-4">
                        {/* Workout name */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="workout-name"
                            className="block text-[10px] font-bold uppercase
                                       tracking-wider text-[#d1c5ab]"
                          >
                            Workout Name <span aria-label="required">*</span>
                          </label>
                          <input
                            id="workout-name"
                            type="text"
                            placeholder="e.g. Monday 45-min Strength"
                            value={title}
                            onChange={(e) => {
                              setTitleTouched(true);
                              setTitle(e.target.value);
                            }}
                            aria-required="true"
                            aria-invalid={showTitleError}
                            aria-describedby={showTitleError ? 'workout-name-error' : undefined}
                            className={`w-full bg-[#0e0e0e] border rounded-xl
                                       px-4 py-3 text-sm text-[#e5e2e1]
                                       outline-none transition-colors
                                       placeholder:text-[#d1c5ab]/30 min-h-[48px]
                                       ${showTitleError
                                         ? 'border-red-500/60 focus:border-red-400'
                                         : 'border-white/10 focus:border-[#f5c400]'
                                       }`}
                          />
                          {showTitleError && (
                            <p id="workout-name-error" className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">error</span>
                              Workout name is required
                            </p>
                          )}
                        </div>

                        {/* Target duration */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="workout-duration"
                            className="block text-[10px] font-bold uppercase
                                       tracking-wider text-[#d1c5ab]"
                          >
                            Target Duration <span aria-label="required">*</span>
                          </label>
                          <select
                            id="workout-duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            aria-required="true"
                            className="w-full bg-[#0e0e0e] border border-white/10
                                       rounded-xl px-4 py-3 text-sm text-[#f5c400]
                                       outline-none focus:border-[#f5c400]
                                       transition-colors cursor-pointer min-h-[48px]
                                       appearance-none"
                          >
                            <option value="30 mins">30 Minutes</option>
                            <option value="45 mins">45 Minutes</option>
                            <option value="60 mins">60 Minutes</option>
                            <option value="75 mins">75 Minutes</option>
                            <option value="90 mins">90 Minutes</option>
                          </select>
                        </div>
                      </section>

                      {/* ── Exercises ───────────────────────────────────── */}
                      <section aria-label="Exercises" className="space-y-3">
                        {/* Section header */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider text-[#f5c400]"
                            aria-live="polite"
                          >
                            Exercises ({exercises.length}) *
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={openLibraryForNew}
                              className="flex items-center gap-1.5 h-9 px-3
                                         bg-[#f5c400] text-black text-[10px] font-bold
                                         rounded-lg hover:brightness-105 transition-all
                                         cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs" aria-hidden="true">
                                search
                              </span>
                              Library
                            </button>
                            <button
                              type="button"
                              onClick={handleAddExercise}
                              className="flex items-center gap-1.5 h-9 px-3
                                         border border-[#f5c400]/40 text-[#f5c400]
                                         text-[10px] font-bold rounded-lg
                                         hover:bg-[#f5c400]/10 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs" aria-hidden="true">
                                add
                              </span>
                              Blank
                            </button>
                          </div>
                        </div>

                        {/* Exercise cards */}
                        <div className="space-y-2">
                          {exercises.length === 0 && (
                            <div className="py-8 text-center">
                              <p className="text-sm text-[#d1c5ab]/40 font-medium">
                                No exercises yet
                              </p>
                              <p className="text-xs text-[#d1c5ab]/25 mt-1">
                                Add from library or create blank
                              </p>
                            </div>
                          )}
                          {exercises.map((ex, idx) => (
                            <ExerciseBuilder
                              key={idx}
                              exercise={ex}
                              index={idx}
                              total={exercises.length}
                              onMoveUp={() => handleMoveUp(idx)}
                              onMoveDown={() => handleMoveDown(idx)}
                              onRemove={() => handleRemoveExercise(idx)}
                              onDuplicate={() => handleDuplicateExercise(idx)}
                              onOpenLibrary={() => openLibraryForReplace(idx)}
                              onChange={(field, value) =>
                                handleExerciseChange(idx, field, value)
                              }
                            />
                          ))}
                        </div>
                      </section>

                      {/* Bottom padding so last item isn't hidden behind footer */}
                      <div className="h-2" aria-hidden="true" />
                    </div>
                  </form>
                </div>

                {/* ── Fixed Footer ──────────────────────────────────────── */}
                <div
                  className="flex-shrink-0 flex items-center gap-3
                              px-4 sm:px-5 py-3 sm:py-4
                              border-t border-white/5 bg-[#1a1919]"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving}
                    className="flex-1 h-12 bg-[#262525] text-[#d1c5ab]
                               rounded-xl text-xs font-bold uppercase tracking-wider
                               hover:text-white hover:bg-[#2e2d2d]
                               transition-colors active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form={formId}
                    disabled={!isValid || isSaving}
                    aria-busy={isSaving}
                    className="flex-1 h-12 bg-[#f5c400] text-black font-bold
                               text-xs uppercase tracking-wider rounded-xl
                               shadow-[0_0_15px_rgba(245,196,0,0.3)]
                               hover:brightness-105 active:scale-[0.98]
                               transition-all flex items-center justify-center gap-2
                               disabled:opacity-40 disabled:cursor-not-allowed
                               disabled:shadow-none"
                  >
                    {isSaving ? (
                      <>
                        <span
                          className="w-4 h-4 border-2 border-black/30 border-t-black
                                     rounded-full animate-spin"
                          aria-hidden="true"
                        />
                        Saving…
                      </>
                    ) : (
                      'Save Plan'
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Exercise Library – z-[70] renders above this modal */}
      <ExerciseLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectExercise={onLibrarySelect}
        title={replacingIdx !== null ? `Replace Exercise #${replacingIdx + 1}` : 'Select Exercise'}
      />
    </>
  );
}
