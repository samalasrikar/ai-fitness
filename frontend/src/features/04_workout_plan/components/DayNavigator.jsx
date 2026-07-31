import React from 'react';
import { getFormattedDayDate } from '../utils/workout.utils';

export default function DayNavigator({ activeDay, onSelectPrev, onSelectNext }) {
  const dateFormatted = getFormattedDayDate(activeDay);

  return (
    <div className="flex items-center justify-between bg-surface-container/80 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg">
      <button
        onClick={onSelectPrev}
        className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-on-surface-variant hover:text-primary hover:bg-white/5 rounded-xl transition-all cursor-pointer"
        aria-label="Previous day"
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
        <span>Previous</span>
      </button>

      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Training Day</span>
        <h4 className="text-sm font-black text-on-surface tracking-wide">{dateFormatted}</h4>
      </div>

      <button
        onClick={onSelectNext}
        className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-on-surface-variant hover:text-primary hover:bg-white/5 rounded-xl transition-all cursor-pointer"
        aria-label="Next day"
      >
        <span>Next</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
    </div>
  );
}
