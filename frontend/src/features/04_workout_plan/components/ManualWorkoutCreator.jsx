import { useState } from 'react';
import { motion } from 'framer-motion';
import ExerciseLibraryModal from '../../05_exercise_library/components/ExerciseLibraryModal';

export default function ManualWorkoutCreator({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [error, setError] = useState(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [replacingIdx, setReplacingIdx] = useState(null);
  const [exercises, setExercises] = useState([
    { name: 'Barbell Bench Press', sets: '4', reps: '10', weightKg: '80', restTimeSec: '90', notes: 'Chest focus' },
  ]);

  if (!isOpen) return null;

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      { name: '', sets: '', reps: '', weightKg: '', restTimeSec: '60', notes: '' },
    ]);
  };

  const handleRemoveExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    setExercises((prev) => {
      const copy = [...prev];
      const temp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  const handleMoveDown = (idx) => {
    if (idx === exercises.length - 1) return;
    setExercises((prev) => {
      const copy = [...prev];
      const temp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  const handleSelectFromLibrary = (selectedEx) => {
    if (replacingIdx !== null) {
      setExercises((prev) => {
        const copy = [...prev];
        copy[replacingIdx] = { ...copy[replacingIdx], name: selectedEx.name };
        return copy;
      });
      setReplacingIdx(null);
    } else {
      setExercises((prev) => [
        ...prev,
        { name: selectedEx.name, sets: '3', reps: '10', weightKg: '0', restTimeSec: '60', notes: `${selectedEx.muscleGroup} exercise` },
      ]);
    }
  };

  const handleExerciseChange = (idx, field, value) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title || title.trim() === '') {
      setError('Workout Name is required.');
      return;
    }
    if (!duration || duration.trim() === '') {
      setError('Target Duration is required.');
      return;
    }
    if (exercises.length === 0) {
      setError('At least one exercise is required.');
      return;
    }

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      if (!ex.name || ex.name.trim() === '') {
        setError(`Exercise #${i + 1} requires a name.`);
        return;
      }
      if (!ex.sets || isNaN(Number(ex.sets))) {
        setError(`Exercise "${ex.name}" requires a valid number of sets.`);
        return;
      }
      if (!ex.reps || String(ex.reps).trim() === '') {
        setError(`Exercise "${ex.name}" requires reps.`);
        return;
      }
    }

    onSave({
      title: title.trim(),
      duration,
      exercises,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#1a1919] border border-[#f5c400]/30 rounded-2xl p-6 shadow-2xl space-y-5 text-[#e5e2e1] my-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#f5c400]">Create Manual Workout Plan</h3>
          <button onClick={onClose} className="text-[#d1c5ab]/60 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Workout Name *</label>
            <input
              type="text"
              placeholder="e.g. Monday 45-minute Workout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#f5c400]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Target Duration *</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#f5c400] outline-none"
            >
              <option value="30 mins">30 Minutes</option>
              <option value="45 mins">45 Minutes</option>
              <option value="60 mins">60 Minutes</option>
              <option value="90 mins">90 Minutes</option>
            </select>
          </div>

          {/* Exercises list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#f5c400]">
                Exercises ({exercises.length}) *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplacingIdx(null);
                    setIsLibraryOpen(true);
                  }}
                  className="text-xs font-bold text-black bg-[#f5c400] px-2.5 py-1 rounded-lg flex items-center gap-1 hover:brightness-105 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">search</span>
                  Exercise Library
                </button>
                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="text-xs font-bold text-[#f5c400] border border-[#f5c400]/40 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-[#f5c400]/10 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Blank
                </button>
              </div>
            </div>

            {exercises.map((ex, idx) => (
              <div key={idx} className="p-3 bg-[#0e0e0e] border border-white/10 rounded-xl space-y-3 relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Reorder controls */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="text-[#d1c5ab]/60 hover:text-white disabled:opacity-20"
                    >
                      <span className="material-symbols-outlined text-base">arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      disabled={idx === exercises.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="text-[#d1c5ab]/60 hover:text-white disabled:opacity-20"
                    >
                      <span className="material-symbols-outlined text-base">arrow_downward</span>
                    </button>
                    <span className="text-xs font-bold text-[#f5c400]">{idx + 1}.</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Exercise Name (e.g. Bench Press) *"
                    value={ex.name}
                    onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                    className="flex-1 bg-[#1a1919] border border-white/5 rounded px-2.5 py-1.5 text-xs text-[#e5e2e1] font-bold outline-none focus:border-[#f5c400]"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setReplacingIdx(idx);
                      setIsLibraryOpen(true);
                    }}
                    className="text-[10px] font-bold text-[#f5c400] bg-[#f5c400]/10 border border-[#f5c400]/20 px-2 py-1 rounded"
                    title="Replace with exercise from library"
                  >
                    Replace
                  </button>

                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(idx)}
                      className="text-red-400 hover:text-red-300"
                      title="Remove exercise"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#d1c5ab]/60">Sets *</span>
                    <input
                      type="number"
                      placeholder="e.g. 4"
                      value={ex.sets}
                      onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                      className="w-full bg-[#1a1919] border border-white/5 rounded px-2 py-1 text-xs text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#d1c5ab]/60">Reps *</span>
                    <input
                      type="text"
                      placeholder="e.g. 10"
                      value={ex.reps}
                      onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                      className="w-full bg-[#1a1919] border border-white/5 rounded px-2 py-1 text-xs text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#d1c5ab]/60">Weight (kg)</span>
                    <input
                      type="number"
                      placeholder="e.g. 80"
                      value={ex.weightKg}
                      onChange={(e) => handleExerciseChange(idx, 'weightKg', e.target.value)}
                      className="w-full bg-[#1a1919] border border-white/5 rounded px-2 py-1 text-xs text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#d1c5ab]/60">Rest (s)</span>
                    <input
                      type="number"
                      placeholder="e.g. 60"
                      value={ex.restTimeSec}
                      onChange={(e) => handleExerciseChange(idx, 'restTimeSec', e.target.value)}
                      className="w-full bg-[#1a1919] border border-white/5 rounded px-2 py-1 text-xs text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={ex.notes}
                    onChange={(e) => handleExerciseChange(idx, 'notes', e.target.value)}
                    className="w-full bg-[#1a1919] border border-white/5 rounded px-2.5 py-1 text-[11px] text-[#d1c5ab] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#262525] text-[#d1c5ab] rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#f5c400] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(245,196,0,0.3)]"
            >
              Save Plan
            </button>
          </div>
        </form>
      </motion.div>

      {/* Exercise Library Selection Modal */}
      <ExerciseLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectExercise={handleSelectFromLibrary}
        title={replacingIdx !== null ? `Replace Exercise #${replacingIdx + 1}` : 'Select Exercise'}
      />
    </div>
  );
}
