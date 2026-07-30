import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseLibraryModal from '../../05_exercise_library/components/ExerciseLibraryModal';
import ExerciseBuilder from './ExerciseBuilder';
import { useWorkoutPlanner } from '../hooks/useWorkoutPlanner';
import { useState } from 'react';

/**
 * ManualWorkoutModal – Mobile-first bottom-sheet modal for creating a workout.
 *
 * ✅ Max-height: 92dvh – never extends beyond viewport
 * ✅ Fixed header (title + close button)
 * ✅ Scrollable content area only – background does NOT scroll
 * ✅ Fixed footer with Cancel and Save buttons
 * ✅ Body scroll lock on open; scroll position restored on close
 * ✅ ESC key closes modal
 * ✅ ARIA role="dialog" + aria-modal + focus management
 * ✅ z-index 60 – covers BottomNav (z-[1000]) via overlay
 */
export default function ManualWorkoutModal({ isOpen, onClose, onSave }) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [replacingIdx, setReplacingIdx] = useState(null);
  const firstFocusRef = useRef(null);
  const formId = 'manual-workout-form';

  const {
    title,
    setTitle,
    duration,
    setDuration,
    error,
    exercises,
    handleAddExercise,
    handleRemoveExercise,
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
      window.scrollTo(0, -parseInt(savedTop || '0', 10));
    };
  }, [isOpen]);

  // ── ESC key handler ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape' && !isLibraryOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, isLibraryOpen, onClose]);

  // ── Focus first element on open ───────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow animation to start
      const t = setTimeout(() => firstFocusRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

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

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* ── Backdrop – z-60 covers BottomNav at z-[1000] via stacking context ── */}
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

            {/* ── Modal sheet ── */}
            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="manual-modal-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-x-0 bottom-0 sm:inset-0 z-[61]
                         flex items-end sm:items-center justify-center
                         pointer-events-none px-0 sm:px-4"
            >
              <div
                className="pointer-events-auto w-full sm:max-w-lg
                           flex flex-col
                           max-h-[92dvh]
                           bg-[#1a1919] border border-[#f5c400]/20
                           rounded-t-2xl sm:rounded-2xl
                           shadow-2xl text-[#e5e2e1] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ── Fixed Header ── */}
                <div className="flex-shrink-0 flex items-center justify-between
                                px-5 pt-5 pb-4 border-b border-white/5">
                  {/* Drag handle (mobile visual cue) */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2
                                  w-10 h-1 bg-white/10 rounded-full sm:hidden" />
                  <h2
                    id="manual-modal-title"
                    className="text-base font-bold text-[#f5c400] tracking-tight"
                  >
                    Create Manual Workout Plan
                  </h2>
                  <button
                    type="button"
                    ref={firstFocusRef}
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="w-9 h-9 flex items-center justify-center
                               rounded-lg text-[#d1c5ab]/60 hover:text-white
                               hover:bg-white/5 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">
                      close
                    </span>
                  </button>
                </div>

                {/* ── Scrollable Content ── */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <form id={formId} onSubmit={handleSubmit}>
                    <div className="px-5 py-4 space-y-5">
                      {/* Error banner */}
                      {error && (
                        <div
                          role="alert"
                          className="flex items-center gap-2 p-3 bg-red-500/10
                                     border border-red-500/20 rounded-xl
                                     text-xs text-red-400 font-bold"
                        >
                          <span className="material-symbols-outlined text-sm flex-shrink-0">
                            error
                          </span>
                          {error}
                        </div>
                      )}

                      {/* Workout name */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="workout-name"
                          className="text-[10px] font-bold uppercase tracking-wider text-[#d1c5ab]"
                        >
                          Workout Name *
                        </label>
                        <input
                          id="workout-name"
                          type="text"
                          placeholder="e.g. Monday 45-minute Workout"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-[#0e0e0e] border border-white/10
                                     rounded-xl px-4 py-3 text-sm text-[#e5e2e1]
                                     outline-none focus:border-[#f5c400]
                                     transition-colors placeholder:text-[#d1c5ab]/30
                                     min-h-[44px]"
                        />
                      </div>

                      {/* Target duration */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="workout-duration"
                          className="text-[10px] font-bold uppercase tracking-wider text-[#d1c5ab]"
                        >
                          Target Duration *
                        </label>
                        <select
                          id="workout-duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-[#0e0e0e] border border-white/10
                                     rounded-xl px-4 py-3 text-sm text-[#f5c400]
                                     outline-none focus:border-[#f5c400]
                                     transition-colors cursor-pointer min-h-[44px]"
                        >
                          <option value="30 mins">30 Minutes</option>
                          <option value="45 mins">45 Minutes</option>
                          <option value="60 mins">60 Minutes</option>
                          <option value="90 mins">90 Minutes</option>
                        </select>
                      </div>

                      {/* Exercises section */}
                      <div className="space-y-3">
                        {/* Section header */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5c400]">
                            Exercises ({exercises.length}) *
                          </label>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={openLibraryForNew}
                              className="flex items-center gap-1 h-8 px-2.5
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
                              className="flex items-center gap-1 h-8 px-2.5
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

                        {/* Exercise list */}
                        <div className="space-y-3">
                          {exercises.map((ex, idx) => (
                            <ExerciseBuilder
                              key={idx}
                              exercise={ex}
                              index={idx}
                              total={exercises.length}
                              onMoveUp={() => handleMoveUp(idx)}
                              onMoveDown={() => handleMoveDown(idx)}
                              onRemove={() => handleRemoveExercise(idx)}
                              onOpenLibrary={() => openLibraryForReplace(idx)}
                              onChange={(field, value) =>
                                handleExerciseChange(idx, field, value)
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {/* Bottom padding so last item isn't behind footer */}
                      <div className="h-2" aria-hidden="true" />
                    </div>
                  </form>
                </div>

                {/* ── Fixed Footer ── */}
                <div className="flex-shrink-0 flex items-center gap-3
                                px-5 pt-4 pb-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-12 bg-[#262525] text-[#d1c5ab]
                               rounded-xl text-xs font-bold uppercase tracking-wider
                               hover:text-white hover:bg-[#2e2d2d]
                               transition-colors active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form={formId}
                    className="flex-1 h-12 bg-[#f5c400] text-black font-bold
                               text-xs uppercase tracking-wider rounded-xl
                               shadow-[0_0_15px_rgba(245,196,0,0.3)]
                               hover:brightness-105 active:scale-[0.98]
                               transition-all"
                  >
                    Save Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Exercise Library – z-70 renders above this modal */}
      <ExerciseLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectExercise={onLibrarySelect}
        title={replacingIdx !== null ? `Replace Exercise #${replacingIdx + 1}` : 'Select Exercise'}
      />
    </>
  );
}
