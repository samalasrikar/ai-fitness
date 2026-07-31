import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Computes dynamic date label for a given day of the current week (e.g. "Monday, 31 Jul")
 */
function getDateLabel(dayName) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  // Convert JS day of week (0=Sunday, 1=Monday...6=Saturday) to 0=Monday...6=Sunday
  const normalizedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const dayIndex = DAYS.indexOf(dayName);
  if (dayIndex === -1) return dayName;

  const diffDays = dayIndex - normalizedDay;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diffDays);

  const dateNum = targetDate.getDate();
  const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
  return `${dayName}, ${dateNum} ${monthName}`;
}

/**
 * DaySelector – Single centered pill navigation card matching reference UI.
 *
 * ✅ Single centered navigation card (pill shape)
 * ✅ Shows active day + dynamic date ("Monday, 31 Jul")
 * ✅ Chevron left / right 44×44 px touch target controls
 * ✅ Smooth Framer Motion transitions (180ms)
 * ✅ Keyboard navigation (ArrowLeft / ArrowRight)
 * ✅ Disables navigation at bounds (Monday / Sunday)
 */
export default function DaySelector({ activeDay, onSelectDay }) {
  const currentIndex = DAYS.indexOf(activeDay);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  const isFirstDay = safeIndex === 0;
  const isLastDay = safeIndex === DAYS.length - 1;

  const handlePrev = useCallback(() => {
    if (!isFirstDay) {
      onSelectDay(DAYS[safeIndex - 1]);
    }
  }, [isFirstDay, safeIndex, onSelectDay]);

  const handleNext = useCallback(() => {
    if (!isLastDay) {
      onSelectDay(DAYS[safeIndex + 1]);
    }
  }, [isLastDay, safeIndex, onSelectDay]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const formattedLabel = getDateLabel(activeDay || DAYS[0]);

  return (
    <div className="w-full flex justify-center py-2 px-1">
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Workout day navigator. Use left and right arrow keys to navigate."
        className="w-full max-w-[500px] md:w-[80%] sm:w-[90%] h-[68px]
                   bg-[#161616] border border-[#2A2A2A] rounded-full
                   flex items-center justify-between px-3 sm:px-4
                   shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                   outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400]"
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirstDay}
          aria-label="Previous day"
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center
                     text-[#d1c5ab] hover:text-[#f5c400] hover:bg-[#f5c400]/10
                     active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed
                     disabled:hover:bg-transparent disabled:hover:text-[#d1c5ab]
                     transition-all duration-200 cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-2xl select-none" aria-hidden="true">
            chevron_left
          </span>
        </button>

        {/* Centered Animated Date Label */}
        <div className="flex-1 min-w-0 text-center overflow-hidden px-2 select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                {formattedLabel}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isLastDay}
          aria-label="Next day"
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center
                     text-[#d1c5ab] hover:text-[#f5c400] hover:bg-[#f5c400]/10
                     active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed
                     disabled:hover:bg-transparent disabled:hover:text-[#d1c5ab]
                     transition-all duration-200 cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-2xl select-none" aria-hidden="true">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
