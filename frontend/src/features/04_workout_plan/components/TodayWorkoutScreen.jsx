import React from 'react';
import DayNavigator from './DayNavigator';
import ExerciseCard from './ExerciseCard';

export default function TodayWorkoutScreen({
  activeDay,
  onSelectPrevDay,
  onSelectNextDay,
  workoutPlan,
  isLoading,
  onStartWorkout,
  onOpenBuilder,
  onReplaceExercise,
  completedExercises = {},
  onToggleExercise,
}) {
  const exercises = workoutPlan?.exercises || [];
  const totalExercises = exercises.length;
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progressPercent = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Day Navigator */}
      <DayNavigator
        activeDay={activeDay}
        onSelectPrev={onSelectPrevDay}
        onSelectNext={onSelectNextDay}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-surface-container/40 rounded-3xl border border-white/5 p-6">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-xs text-on-surface-variant font-semibold">Loading daily training routine...</p>
        </div>
      ) : !workoutPlan ? (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-surface-container/60 backdrop-blur-lg rounded-[28px] border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Workout Scheduled</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mt-1">
              Create a custom routine manually or let AI generate an optimized training session for {activeDay}.
            </p>
          </div>
          <button
            onClick={onOpenBuilder}
            className="px-6 py-3 bg-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(245,196,0,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Open Workout Builder
          </button>
        </div>
      ) : (
        <>
          {/* Today's Workout Overview Card */}
          <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-[28px] p-6 border border-primary/20 shadow-2xl relative overflow-hidden space-y-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                  {workoutPlan.muscleGroup || 'Full Body'}
                </span>
                <h2 className="text-2xl font-extrabold text-white pt-1">{workoutPlan.title}</h2>
              </div>

              <button
                onClick={onStartWorkout}
                className="px-6 py-3 bg-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(245,196,0,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                Start Workout
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-surface-bright/50 p-3 rounded-2xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Duration</span>
                <p className="text-sm font-black text-white">{workoutPlan.duration || '45 min'}</p>
              </div>

              <div className="bg-surface-bright/50 p-3 rounded-2xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Exercises</span>
                <p className="text-sm font-black text-white">{totalExercises} Movements</p>
              </div>

              <div className="bg-surface-bright/50 p-3 rounded-2xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Est. Calories</span>
                <p className="text-sm font-black text-amber-400">{workoutPlan.estimatedCalories || 380} kcal</p>
              </div>

              <div className="bg-surface-bright/50 p-3 rounded-2xl border border-white/5 space-y-0.5">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Progress</span>
                <p className="text-sm font-black text-primary">{progressPercent}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                <span>Completed Exercises</span>
                <span className="text-primary font-bold">{completedCount} of {totalExercises}</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Exercise Cards Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold text-on-surface-variant uppercase tracking-widest">
                Target Exercises ({totalExercises})
              </h3>
              <button
                onClick={onOpenBuilder}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Workout
              </button>
            </div>

            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <ExerciseCard
                  key={idx}
                  exercise={ex}
                  index={idx}
                  isCompleted={Boolean(completedExercises[idx])}
                  onToggleComplete={() => onToggleExercise && onToggleExercise(idx)}
                  onReplace={() => onReplaceExercise && onReplaceExercise(ex)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
