import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXERCISE_DATABASE = [
  { id: 'ex-1',  name: 'Barbell Bench Press',     muscleGroup: 'Chest',     equipment: 'Barbell',    category: 'Strength'   },
  { id: 'ex-2',  name: 'Incline Dumbbell Press',   muscleGroup: 'Chest',     equipment: 'Dumbbell',   category: 'Hypertrophy'},
  { id: 'ex-3',  name: 'Push-ups',                 muscleGroup: 'Chest',     equipment: 'Bodyweight', category: 'Endurance'  },
  { id: 'ex-4',  name: 'Barbell Back Squat',       muscleGroup: 'Legs',      equipment: 'Barbell',    category: 'Strength'   },
  { id: 'ex-5',  name: 'Leg Press',                muscleGroup: 'Legs',      equipment: 'Machine',    category: 'Hypertrophy'},
  { id: 'ex-6',  name: 'Romanian Deadlift',        muscleGroup: 'Legs',      equipment: 'Barbell',    category: 'Posterior'  },
  { id: 'ex-7',  name: 'Bent-Over Barbell Row',    muscleGroup: 'Back',      equipment: 'Barbell',    category: 'Strength'   },
  { id: 'ex-8',  name: 'Lat Pulldown',             muscleGroup: 'Back',      equipment: 'Cable',      category: 'Hypertrophy'},
  { id: 'ex-9',  name: 'Pull-ups',                 muscleGroup: 'Back',      equipment: 'Bodyweight', category: 'Strength'   },
  { id: 'ex-10', name: 'Standing Overhead Press',  muscleGroup: 'Shoulders', equipment: 'Barbell',    category: 'Strength'   },
  { id: 'ex-11', name: 'Dumbbell Lateral Raise',   muscleGroup: 'Shoulders', equipment: 'Dumbbell',   category: 'Hypertrophy'},
  { id: 'ex-12', name: 'Barbell Bicep Curl',       muscleGroup: 'Arms',      equipment: 'Barbell',    category: 'Hypertrophy'},
  { id: 'ex-13', name: 'Tricep Rope Pushdown',     muscleGroup: 'Arms',      equipment: 'Cable',      category: 'Hypertrophy'},
  { id: 'ex-14', name: 'Hanging Leg Raise',        muscleGroup: 'Core',      equipment: 'Bodyweight', category: 'Core'       },
  { id: 'ex-15', name: 'Plank',                    muscleGroup: 'Core',      equipment: 'Bodyweight', category: 'Core'       },
];

const MUSCLE_GROUPS = ['All', 'Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Core'];

/**
 * ExerciseLibraryModal
 *
 * ✅ z-[70] – renders above ManualWorkoutModal (z-61) and RestTimer (z-66)
 * ✅ Bottom-sheet on mobile, centred on sm+
 * ✅ Body scroll lock inherited from parent; no double-lock
 * ✅ ESC closes this layer only
 * ✅ Accessible: role="dialog", aria-modal, labelled header
 */
export default function ExerciseLibraryModal({
  isOpen,
  onClose,
  onSelectExercise,
  title = 'Exercise Library',
}) {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  // ESC closes only this modal
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  // Reset filters each time modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedGroup('All');
    }
  }, [isOpen]);

  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || ex.muscleGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop – z-70 */}
          <motion.div
            key="lib-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet – z-71 */}
          <motion.div
            key="lib-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lib-modal-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 z-[71]
                       flex items-end sm:items-center justify-center
                       pointer-events-none px-0 sm:px-4"
          >
            <div
              className="pointer-events-auto w-full sm:max-w-md
                         flex flex-col max-h-[85dvh]
                         bg-[#1a1919] border border-[#f5c400]/30
                         rounded-t-2xl sm:rounded-2xl
                         shadow-2xl text-[#e5e2e1] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Header ── */}
              <div className="flex-shrink-0 flex items-center justify-between
                              px-5 pt-5 pb-4 border-b border-white/5">
                {/* Mobile drag handle */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2
                                w-10 h-1 bg-white/10 rounded-full sm:hidden" />
                <div className="flex items-center gap-2 text-[#f5c400]">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    fitness_center
                  </span>
                  <h3
                    id="lib-modal-title"
                    className="text-base font-extrabold tracking-tight"
                  >
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close exercise library"
                  className="w-9 h-9 flex items-center justify-center
                             rounded-lg text-[#d1c5ab]/60 hover:text-white
                             hover:bg-white/5 transition-colors flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    close
                  </span>
                </button>
              </div>

              {/* ── Search + Filter (fixed within sheet) ── */}
              <div className="flex-shrink-0 px-5 pt-3 pb-2 space-y-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search exercise by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search exercises"
                    className="w-full bg-[#0e0e0e] border border-white/10
                               rounded-xl px-4 py-2.5 pl-10 text-xs text-[#e5e2e1]
                               outline-none focus:border-[#f5c400] transition-colors
                               min-h-[44px]"
                  />
                  <span
                    className="material-symbols-outlined text-sm text-[#d1c5ab]/50
                               absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    search
                  </span>
                </div>

                {/* Muscle group chips */}
                <div
                  role="group"
                  aria-label="Filter by muscle group"
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pr-2"
                >
                  {MUSCLE_GROUPS.map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      aria-pressed={selectedGroup === group}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold
                                  whitespace-nowrap transition-all min-h-[36px] ${
                        selectedGroup === group
                          ? 'bg-[#f5c400] text-black shadow-[0_0_10px_rgba(245,196,0,0.3)]'
                          : 'bg-[#262525] text-[#d1c5ab] hover:text-white border border-white/5'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Scrollable exercise list ── */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 space-y-2">
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-10 text-xs text-[#d1c5ab]/60">
                    No exercises found matching your filter.
                  </div>
                ) : (
                  filteredExercises.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => {
                        onSelectExercise(ex);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3
                                 bg-[#0e0e0e] border border-white/5
                                 hover:border-[#f5c400]/40 rounded-xl
                                 cursor-pointer transition-all group
                                 text-left min-h-[56px]"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#e5e2e1]
                                       group-hover:text-[#f5c400] transition-colors">
                          {ex.name}
                        </h4>
                        <p className="text-[10px] text-[#d1c5ab]/60 mt-0.5">
                          {ex.muscleGroup} · {ex.equipment}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[9px] font-bold text-[#f5c400]
                                       bg-[#f5c400]/10 px-2 py-1 rounded-full
                                       border border-[#f5c400]/20 ml-3">
                        + SELECT
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
