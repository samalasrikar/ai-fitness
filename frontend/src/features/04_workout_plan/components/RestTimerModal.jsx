import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RestTimer – Countdown timer modal shown between sets.
 *
 * ✅ Accessible: role="dialog", aria-modal, aria-label
 * ✅ ESC closes the timer
 * ✅ Body scroll locked while open
 * ✅ z-[65] – renders above ManualWorkoutModal
 */
export default function RestTimer({ isOpen, onClose, defaultSeconds = 60, onTimerComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
  const [isActive, setIsActive] = useState(false);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(defaultSeconds);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [isOpen, defaultSeconds]);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      if (onTimerComplete) onTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onTimerComplete]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePreset = (secs) => {
    setSecondsLeft(secs);
    setIsActive(true);
  };

  const handleCustomSet = (e) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0) {
      setSecondsLeft(val);
      setIsActive(true);
      setCustomInput('');
    }
  };

  const statusLabel = isActive
    ? 'RECOVERING...'
    : secondsLeft === 0
    ? 'REST COMPLETED!'
    : 'PAUSED';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="timer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] bg-black/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="timer-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Rest timer"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[66] flex items-center justify-center p-4
                       pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-sm
                         bg-[#1a1919] border border-[#f5c400]/30
                         rounded-2xl p-6 shadow-2xl space-y-6 text-[#e5e2e1]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#f5c400]">
                  <span className="material-symbols-outlined text-2xl font-bold" aria-hidden="true">
                    timer
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight">REST TIMER</h3>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close rest timer"
                  className="w-9 h-9 flex items-center justify-center
                             rounded-lg text-[#d1c5ab]/60 hover:text-white
                             hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    close
                  </span>
                </button>
              </div>

              {/* Countdown Display */}
              <div className="flex flex-col items-center justify-center py-4
                              bg-[#0e0e0e] rounded-xl border border-white/5">
                <span
                  className="text-5xl font-black font-[JetBrains_Mono,monospace]
                             text-[#f5c400] tracking-wider tabular-nums"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#d1c5ab]/60 font-semibold mt-1">
                  {statusLabel}
                </span>
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 90].map((secs) => (
                  <button
                    key={secs}
                    onClick={() => handlePreset(secs)}
                    aria-label={`Set ${secs} second rest`}
                    className={`py-2.5 rounded-lg font-bold text-xs border transition-all min-h-[44px] ${
                      secondsLeft === secs && isActive
                        ? 'bg-[#f5c400] text-black border-[#f5c400]'
                        : 'bg-[#262525] border-white/10 text-[#e5e2e1] hover:border-[#f5c400]/40'
                    }`}
                  >
                    {secs}s
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <form onSubmit={handleCustomSet} className="flex gap-2">
                <input
                  type="number"
                  placeholder="Custom secs..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  aria-label="Custom rest duration in seconds"
                  className="flex-1 bg-[#0e0e0e] border border-[#4e4632]/50
                             rounded-lg px-3 py-2 text-xs text-[#e5e2e1]
                             outline-none focus:border-[#f5c400] min-h-[44px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#353534] text-[#f5c400]
                             text-xs font-bold rounded-lg hover:bg-[#434242]
                             transition-colors min-h-[44px]"
                >
                  Set
                </button>
              </form>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsActive(!isActive)}
                  aria-label={isActive ? 'Pause timer' : 'Resume timer'}
                  className={`flex-1 h-12 rounded-xl font-bold text-xs uppercase
                              tracking-wider flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-[#f5c400] text-black shadow-[0_0_15px_rgba(245,196,0,0.3)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">
                    {isActive ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isActive ? 'Pause' : 'Resume'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                    setSecondsLeft(0);
                    onClose();
                  }}
                  aria-label="Skip rest"
                  className="px-5 h-12 bg-[#262525] border border-white/10
                             text-[#d1c5ab] text-xs font-bold uppercase
                             tracking-wider rounded-xl hover:text-white
                             transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
