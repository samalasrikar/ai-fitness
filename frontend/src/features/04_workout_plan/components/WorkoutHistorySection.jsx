import React, { useState, useEffect } from 'react';
import { workoutApi } from '../../../services/api/workout.api';
import { formatStopwatchTime } from '../utils/workout.utils';

export default function WorkoutHistorySection() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    workoutApi
      .getHistory()
      .then((res) => {
        if (mounted) {
          setHistory(res.data?.data || res.data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.aiFeedback && item.aiFeedback.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMuscle =
      muscleFilter === 'All' ||
      item.title.toLowerCase().includes(muscleFilter.toLowerCase());

    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Training Vault</span>
          <h3 className="text-xl font-extrabold text-white">Workout History</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-white/40 text-sm">search</span>
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-bright border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-primary focus:outline-none"
            />
          </div>

          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="bg-surface-bright border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
          >
            <option value="All">All Muscles</option>
            <option value="Chest">Chest</option>
            <option value="Back">Back</option>
            <option value="Legs">Legs</option>
            <option value="Shoulders">Shoulders</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2 bg-surface-container/40 rounded-3xl border border-white/5 p-6">
          <span className="material-symbols-outlined text-primary text-3xl animate-spin">history</span>
          <p className="text-xs text-on-surface-variant font-semibold">Retrieving training logs...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-8 text-center bg-surface-container/60 rounded-3xl border border-white/5 space-y-2">
          <p className="text-xs text-on-surface-variant font-bold">No workout history matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((session) => {
            const dateStr = new Date(session.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const durationStr = formatStopwatchTime(session.durationSeconds || 1800);

            return (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className="p-5 bg-surface-container/90 hover:bg-surface-container border border-white/10 hover:border-primary/40 rounded-3xl space-y-3 cursor-pointer transition-all duration-300 shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase">{dateStr}</span>
                    <h4 className="text-base font-black text-white">{session.title}</h4>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase">
                    100% Completed
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-surface-bright/50 rounded-xl border border-white/5">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Duration</span>
                    <span className="font-extrabold text-white">{durationStr}</span>
                  </div>
                  <div className="p-2.5 bg-surface-bright/50 rounded-xl border border-white/5">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Volume</span>
                    <span className="font-extrabold text-primary">{session.totalVolumeKg} kg</span>
                  </div>
                  <div className="p-2.5 bg-surface-bright/50 rounded-xl border border-white/5">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Calories</span>
                    <span className="font-extrabold text-amber-400">{session.caloriesBurned} kcal</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-surface-container border border-white/10 rounded-[28px] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black text-primary uppercase">Session Details</span>
                <h3 className="text-lg font-extrabold text-white">{selectedSession.title}</h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-bright rounded-xl">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Date</span>
                <p className="font-bold text-white">{new Date(selectedSession.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-3 bg-surface-bright rounded-xl">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Duration</span>
                <p className="font-bold text-white">{formatStopwatchTime(selectedSession.durationSeconds)}</p>
              </div>
            </div>

            {selectedSession.aiFeedback && (
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-xs">
                <span className="text-[10px] font-black text-primary uppercase block">AI Performance Feedback</span>
                <p className="text-white/80 font-medium">{selectedSession.aiFeedback}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-5 py-2 bg-primary text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
