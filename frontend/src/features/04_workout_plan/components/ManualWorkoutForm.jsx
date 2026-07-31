import React, { useState } from 'react';

export default function ManualWorkoutForm({ onSave, onCancel }) {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('Hypertrophy');
  const [muscleGroup, setMuscleGroup] = useState('Chest');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState('45');
  const [notes, setNotes] = useState('');

  const [exercises, setExercises] = useState([
    { name: '', sets: 3, reps: '10', weightKg: '', restTimeSec: 60, tempo: '2-0-2', rpe: 8, instructions: '' },
  ]);

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      { name: '', sets: 3, reps: '10', weightKg: '', restTimeSec: 60, tempo: '2-0-2', rpe: 8, instructions: '' },
    ]);
  };

  const removeExercise = (index) => {
    if (exercises.length === 1) return;
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const moveExercise = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= exercises.length) return;
    const updated = [...exercises];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setExercises(updated);
  };

  const updateExercise = (index, field, value) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workoutName.trim()) {
      alert('Please enter a workout name.');
      return;
    }
    const validExercises = exercises.filter((ex) => ex.name.trim() !== '');
    if (validExercises.length === 0) {
      alert('Please add at least one valid exercise.');
      return;
    }

    onSave({
      title: workoutName,
      workoutType,
      muscleGroup,
      difficulty,
      duration: `${duration} mins`,
      notes,
      exercises: validExercises,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Workout Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Chest & Triceps Blast"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full bg-surface-bright border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Muscle Group</label>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="w-full bg-surface-bright border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
          >
            <option value="Chest">Chest</option>
            <option value="Back">Back</option>
            <option value="Legs">Legs</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Arms">Arms</option>
            <option value="Full Body">Full Body</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-surface-bright border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Duration (mins)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-surface-bright border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Exercises Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-primary">Exercises List</h4>
          <button
            type="button"
            onClick={addExercise}
            className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Exercise
          </button>
        </div>

        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {exercises.map((ex, idx) => (
            <div key={idx} className="p-4 bg-surface-bright/50 rounded-2xl border border-white/10 space-y-3 relative">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold text-primary uppercase">Exercise #{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveExercise(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move Up"
                  >
                    <span className="material-symbols-outlined text-base">arrow_upward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveExercise(idx, 1)}
                    disabled={idx === exercises.length - 1}
                    className="p-1 text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move Down"
                  >
                    <span className="material-symbols-outlined text-base">arrow_downward</span>
                  </button>
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(idx)}
                      className="p-1 text-red-400/60 hover:text-red-400 cursor-pointer"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Exercise Name (e.g. Incline Bench Press)"
                  value={ex.name}
                  onChange={(e) => updateExercise(idx, 'name', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-bold">Sets</label>
                  <input
                    type="number"
                    value={ex.sets}
                    onChange={(e) => updateExercise(idx, 'sets', e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-bold">Reps</label>
                  <input
                    type="text"
                    value={ex.reps}
                    onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-bold">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={ex.weightKg}
                    onChange={(e) => updateExercise(idx, 'weightKg', e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-bold">Rest (s)</label>
                  <input
                    type="number"
                    value={ex.restTimeSec}
                    onChange={(e) => updateExercise(idx, 'restTimeSec', e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-on-surface-variant hover:text-white cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-primary text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,196,0,0.3)] hover:brightness-110 cursor-pointer"
        >
          Save Workout
        </button>
      </div>
    </form>
  );
}
