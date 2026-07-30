import { useRef, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * DaySelector – Horizontally scrollable weekday tab bar.
 *
 * ✅ Never clips the last day (pr-4 padding-right)
 * ✅ Auto-scrolls the active day into view on mount and on change
 * ✅ Touch-friendly sizing (min-h-[44px])
 * ✅ Smooth horizontal scroll, no visible scrollbar
 */
export default function DaySelector({ activeDay, onSelectDay }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  // Auto-scroll the active day into the centre of the viewport whenever it changes
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeDay]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Select training day"
      className="flex items-center gap-2 overflow-x-auto scroll-smooth no-scrollbar
                 px-4 py-1 pr-6"
      // pr-6 ensures the last tab is never hidden behind scroll shadow
    >
      {DAYS.map((day) => {
        const isActive = activeDay === day;
        return (
          <button
            key={day}
            role="tab"
            aria-selected={isActive}
            ref={isActive ? activeRef : null}
            onClick={() => onSelectDay(day)}
            className={`
              flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold
              whitespace-nowrap transition-all cursor-pointer
              min-h-[44px] min-w-[60px]
              ${isActive
                ? 'bg-[#f5c400] text-black shadow-[0_0_10px_rgba(245,196,0,0.3)]'
                : 'bg-[#1a1919] text-[#d1c5ab] hover:text-white border border-white/5 hover:border-[#f5c400]/30'
              }
            `}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}
