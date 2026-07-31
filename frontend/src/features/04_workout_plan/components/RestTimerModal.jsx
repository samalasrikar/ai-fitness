import React, { useCallback } from 'react';
import { useRestTimer } from '../hooks/useRestTimer';
import { formatStopwatchTime } from '../utils/workout.utils';

export default function RestTimerModal({ isOpen, onClose, defaultSeconds = 60, onTimerComplete }) {
  const handleComplete = useCallback(() => {
    if (onTimerComplete) onTimerComplete();
    if (onClose) onClose();
  }, [onTimerComplete, onClose]);

  const { secondsLeft, progressPercent, add30Seconds } = useRestTimer(isOpen, defaultSeconds, handleComplete);

  if (!isOpen) return null;

  const recoveryTips = [
    "Focus on deep diaphragmatic breathing: 4s inhale, 4s hold, 6s exhale.",
    "Sip water with electrolytes to maintain intracellular hydration.",
    "Shake out muscles to release lactic accumulation before the next set.",
    "Visualize peak contraction and target muscle activation for set completion.",
  ];

  const currentTip = recoveryTips[secondsLeft % recoveryTips.length];

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-surface-container border border-primary/30 rounded-[36px] max-w-sm w-full p-8 shadow-[0_0_50px_rgba(245,196,0,0.15)] text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Recovery Interval
          </span>
          <h3 className="text-xl font-black text-white">Rest & Recharge</h3>
        </div>

        {/* Circular Progress Countdown */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-surface-bright"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-primary transition-all duration-1000 ease-linear"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-white font-[JetBrains_Mono,monospace] tracking-tight">
              {formatStopwatchTime(secondsLeft)}
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase mt-1">Resting</span>
          </div>
        </div>

        {/* AI Recovery Tip Card */}
        <div className="p-3.5 bg-surface-bright/60 rounded-2xl border border-white/5 space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-primary text-[11px] font-extrabold uppercase">
            <span className="material-symbols-outlined text-sm">lightbulb</span>
            <span>AI Recovery Protocol</span>
          </div>
          <p className="text-xs text-white/80 font-medium leading-snug">{currentTip}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={add30Seconds}
            className="flex-1 py-3 bg-surface-bright border border-white/10 text-white font-bold text-xs rounded-2xl hover:border-primary/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            +30 Sec
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_15px_rgba(245,196,0,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            Skip Rest
          </button>
        </div>
      </div>
    </div>
  );
}
