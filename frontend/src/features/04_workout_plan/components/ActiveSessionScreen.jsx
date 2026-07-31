import React from 'react';
import { formatStopwatchTime } from '../utils/workout.utils';
import RestTimerModal from './RestTimerModal';

export default function ActiveSessionScreen({
  workoutPlan,
  currentExerciseIndex,
  elapsedSeconds,
  isPaused,
  completedSetsMap,
  isRestTimerOpen,
  setIsRestTimerOpen,
  restDuration,
  onCompleteSet,
  onSkipExercise,
  onPrevExercise,
  onNextExercise,
  onPause,
  onResume,
  onReplaceCurrent,
  onFinishSession,
}) {
  const exercises = workoutPlan?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex] || exercises[0] || {};
  const totalExercises = exercises.length;

  const currentExSets = completedSetsMap[currentExerciseIndex] || [false, false, false];
  const targetSets = Number(currentExercise.sets) || currentExSets.length;
  const completedSetsCount = currentExSets.filter(Boolean).length;

  const totalAllSets = exercises.reduce((sum, ex) => sum + (Number(ex.sets) || 3), 0);
  const totalCompletedAllSets = Object.values(completedSetsMap)
    .flat()
    .filter(Boolean).length;
  const overallProgressPct = totalAllSets > 0 ? Math.round((totalCompletedAllSets / totalAllSets) * 100) : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Top Bar: Timer, Progress & Controls */}
      <div className="bg-surface-container border border-primary/30 rounded-[28px] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">timer</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-primary uppercase">Workout Timer</span>
              <h3 className="text-xl font-black text-white font-[JetBrains_Mono,monospace]">
                {formatStopwatchTime(elapsedSeconds)}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPaused ? (
              <button
                onClick={onResume}
                className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                Resume
              </button>
            ) : (
              <button
                onClick={onPause}
                className="px-3.5 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">pause</span>
                Pause
              </button>
            )}

            <button
              onClick={onFinishSession}
              className="px-4 py-1.5 bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Workout Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
            <span>Overall Session Progress</span>
            <span className="text-primary font-bold">{overallProgressPct}% ({totalCompletedAllSets}/{totalAllSets} Sets)</span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Exercise Visual Card */}
      <div className="bg-surface-container/90 border border-white/10 rounded-[32px] p-6 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Navigation Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={onPrevExercise}
              disabled={currentExerciseIndex === 0}
              className="p-2 rounded-xl bg-surface-bright text-white/70 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous Exercise"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button
              onClick={onNextExercise}
              disabled={currentExerciseIndex === totalExercises - 1}
              className="p-2 rounded-xl bg-surface-bright text-white/70 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next Exercise"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Image Placeholder Frame & Title */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 h-44 rounded-2xl bg-surface-bright border border-white/10 overflow-hidden relative group flex items-center justify-center">
            <img
              src={currentExercise.imgSrc || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400'}
              alt={currentExercise.name || 'Exercise graphic'}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[10px] font-extrabold text-primary uppercase bg-black/60 px-2 py-0.5 rounded border border-primary/30">
                {currentExercise.equipment || 'Dumbbell'}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-2xl font-black text-white">{currentExercise.name}</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-surface-bright/60 rounded-xl border border-white/5">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Target Reps</span>
                <p className="text-sm font-extrabold text-white">{currentExercise.reps || '10'} reps</p>
              </div>
              <div className="p-2.5 bg-surface-bright/60 rounded-xl border border-white/5">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Target Weight</span>
                <p className="text-sm font-extrabold text-amber-400">{currentExercise.weightKg ? `${currentExercise.weightKg} kg` : 'Bodyweight'}</p>
              </div>
            </div>

            {currentExercise.instructions && (
              <p className="text-xs text-white/70 italic bg-white/5 p-3 rounded-xl border border-white/5">
                "{currentExercise.instructions}"
              </p>
            )}
          </div>
        </div>

        {/* Set Completion Checkboxes */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-white uppercase tracking-wider">Set Tracker</span>
            <span className="text-primary font-bold">{completedSetsCount} of {targetSets} Completed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentExSets.map((isDone, setIdx) => (
              <div
                key={setIdx}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isDone
                    ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(245,196,0,0.15)]'
                    : 'bg-surface-bright/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">Set #{setIdx + 1}</span>
                  <p className="text-xs font-extrabold text-white">
                    {currentExercise.reps || 10} reps {currentExercise.weightKg ? `@ ${currentExercise.weightKg}kg` : ''}
                  </p>
                </div>

                <button
                  onClick={() => onCompleteSet(currentExerciseIndex, setIdx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isDone
                      ? 'bg-primary text-black'
                      : 'bg-surface-container border border-primary/40 text-primary hover:bg-primary/20'
                  }`}
                >
                  {isDone ? 'Done ✓' : 'Complete'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex gap-2">
            <button
              onClick={() => onReplaceCurrent(currentExercise)}
              className="px-3.5 py-2 bg-surface-bright hover:bg-primary/10 border border-white/10 hover:border-primary/40 text-xs font-bold text-on-surface-variant hover:text-primary rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
              Replace
            </button>

            <button
              onClick={onSkipExercise}
              className="px-3.5 py-2 bg-surface-bright border border-white/10 text-xs font-bold text-on-surface-variant hover:text-white rounded-xl transition-all cursor-pointer"
            >
              Skip
            </button>
          </div>

          <button
            onClick={() => {
              if (currentExerciseIndex < totalExercises - 1) {
                onNextExercise();
              } else {
                onFinishSession();
              }
            }}
            className="px-6 py-2.5 bg-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(245,196,0,0.3)] hover:brightness-110 cursor-pointer flex items-center gap-1"
          >
            {currentExerciseIndex < totalExercises - 1 ? 'Next Exercise →' : 'Finish Workout ✓'}
          </button>
        </div>
      </div>

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
        defaultSeconds={restDuration}
        onTimerComplete={() => console.log('Rest finished!')}
      />
    </div>
  );
}
