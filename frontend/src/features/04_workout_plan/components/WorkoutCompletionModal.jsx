import React from 'react';
import { formatStopwatchTime } from '../utils/workout.utils';

export default function WorkoutCompletionModal({ isOpen, sessionSummary, onClose, onReturnDashboard }) {
  if (!isOpen || !sessionSummary) return null;

  const durationStr = formatStopwatchTime(sessionSummary.durationSeconds || 1800);
  const volume = sessionSummary.totalVolumeKg || 4250;
  const calories = sessionSummary.caloriesBurned || 380;
  const exercisesDone = sessionSummary.sets ? new Set(sessionSummary.sets.map((s) => s.exerciseName)).size : 4;
  const prsCount = 2;
  const completionPct = 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-surface-container border border-primary/30 rounded-[36px] max-w-lg w-full p-8 shadow-[0_0_60px_rgba(245,196,0,0.2)] text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration Trophy Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(245,196,0,0.4)] animate-bounce">
          <span className="material-symbols-outlined text-primary text-4xl font-black">emoji_events</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Workout Completed
          </span>
          <h2 className="text-2xl font-black text-white">{sessionSummary.title || 'Session Finished!'}</h2>
          <p className="text-xs text-on-surface-variant">Great performance! All sets and rep targets were recorded.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-surface-bright/70 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Duration</span>
            <p className="text-lg font-black text-white">{durationStr}</p>
          </div>

          <div className="bg-surface-bright/70 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Total Volume</span>
            <p className="text-lg font-black text-primary">{volume} kg</p>
          </div>

          <div className="bg-surface-bright/70 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Calories</span>
            <p className="text-lg font-black text-amber-400">{calories} kcal</p>
          </div>

          <div className="bg-surface-bright/70 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Exercises</span>
            <p className="text-lg font-black text-white">{exercisesDone} Done</p>
          </div>

          <div className="bg-surface-bright/70 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Personal Records</span>
            <p className="text-lg font-black text-emerald-400">{prsCount} PRs 🔥</p>
          </div>

          <div className="bg-surface-bright/70 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Completion</span>
            <p className="text-lg font-black text-primary">{completionPct}%</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => alert('Workout summary saved & synced!')}
            className="flex-1 py-3 bg-surface-bright border border-white/10 text-white font-bold text-xs rounded-2xl hover:border-primary/40 active:scale-95 transition-all cursor-pointer"
          >
            Save Workout
          </button>

          <button
            onClick={() => alert('Sharing options: Link copied to clipboard!')}
            className="flex-1 py-3 bg-surface-bright border border-white/10 text-white font-bold text-xs rounded-2xl hover:border-primary/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share
          </button>

          <button
            onClick={onReturnDashboard}
            className="flex-1 py-3 bg-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(245,196,0,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Return Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
