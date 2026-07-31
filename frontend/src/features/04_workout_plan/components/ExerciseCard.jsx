import React from 'react';

export default function ExerciseCard({ exercise, index, onReplace, onToggleComplete, isCompleted }) {
  const sets = exercise.sets || 3;
  const reps = exercise.reps || '10';
  const weight = exercise.weightKg ? `${exercise.weightKg} kg` : null;
  const rest = exercise.restTimeSec ? `${exercise.restTimeSec}s rest` : '60s rest';
  const equipment = exercise.equipment || 'Dumbbell';

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
      isCompleted
        ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(245,196,0,0.1)]'
        : 'bg-surface-container/90 border-white/10 hover:border-primary/30'
    }`}>
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleComplete}
          className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all flex-shrink-0 cursor-pointer ${
            isCompleted ? 'bg-primary border-primary text-black' : 'border-white/20 hover:border-primary/50 text-white/40'
          }`}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted ? (
            <span className="material-symbols-outlined text-base font-black">check</span>
          ) : (
            <span className="text-xs font-bold">{index + 1}</span>
          )}
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-extrabold ${isCompleted ? 'line-through text-on-surface-variant' : 'text-white'}`}>
              {exercise.name}
            </h4>
            {exercise.tag && (
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${exercise.tagColor || 'bg-primary/20 text-primary border border-primary/30'}`}>
                {exercise.tag}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant font-medium">
            <span className="text-primary font-bold">{sets} Sets</span>
            <span>•</span>
            <span>{reps} Reps</span>
            {weight && (
              <>
                <span>•</span>
                <span className="text-amber-400 font-bold">{weight}</span>
              </>
            )}
            <span>•</span>
            <span>{rest}</span>
            <span>•</span>
            <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-[10px]">{equipment}</span>
          </div>

          {exercise.instructions && (
            <p className="text-[11px] text-white/60 italic pt-0.5 line-clamp-1">{exercise.instructions}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        {onReplace && (
          <button
            onClick={() => onReplace(exercise)}
            className="px-3 py-1.5 bg-surface-bright/80 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-on-surface-variant hover:text-primary text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">swap_horiz</span>
            Replace
          </button>
        )}
      </div>
    </div>
  );
}
