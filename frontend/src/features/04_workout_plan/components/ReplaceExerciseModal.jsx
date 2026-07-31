import React, { useState, useEffect } from 'react';
import { workoutApi } from '../../../services/api/workout.api';

export default function ReplaceExerciseModal({ isOpen, onClose, exerciseToReplace, onConfirmReplace }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [alternatives, setAlternatives] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && exerciseToReplace) {
      let mounted = true;
      setIsLoading(true);
      workoutApi
        .replaceExercise({
          currentExerciseName: exerciseToReplace.name,
          targetMuscle: exerciseToReplace.targetMuscle,
          equipment: equipmentFilter,
          difficulty: difficultyFilter,
          searchQuery,
        })
        .then((res) => {
          if (mounted) {
            setAlternatives(res.data?.data || res.data || []);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
      return () => {
        mounted = false;
      };
    }
  }, [isOpen, exerciseToReplace, equipmentFilter, difficultyFilter, searchQuery]);

  if (!isOpen || !exerciseToReplace) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface-container border border-white/10 rounded-[28px] max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Exercise Replacement</span>
            <h3 className="text-lg font-extrabold text-white">Replacing: {exerciseToReplace.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-white/40 text-sm">search</span>
            <input
              type="text"
              placeholder="Search exercise alternatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-bright border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="bg-surface-bright border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
            >
              <option value="All">All Equipment</option>
              <option value="Barbell">Barbell</option>
              <option value="Dumbbell">Dumbbell</option>
              <option value="Machine">Machine</option>
              <option value="Cable">Cable</option>
              <option value="Bodyweight">Bodyweight</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-surface-bright border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Alternatives List */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-on-surface-variant font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary animate-spin text-base">progress_activity</span>
              Searching biomechanical alternatives...
            </div>
          ) : alternatives.length === 0 ? (
            <div className="p-8 text-center text-xs text-on-surface-variant font-bold">
              No matching exercise alternatives found.
            </div>
          ) : (
            alternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-4 bg-surface-bright/60 hover:bg-surface-bright rounded-2xl border border-white/10 hover:border-primary/40 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-white">{alt.name}</h4>
                    <span className="text-[9px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                      {alt.matchScore}% MATCH
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 italic">{alt.reason}</p>
                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-bold">
                    <span>Muscle: {alt.targetMuscle}</span>
                    <span>•</span>
                    <span>Equipment: {alt.equipment}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onConfirmReplace(alt);
                    onClose();
                  }}
                  className="px-4 py-2 bg-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 cursor-pointer"
                >
                  Select
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
