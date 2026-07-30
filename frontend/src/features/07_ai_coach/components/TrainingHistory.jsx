import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useWorkout } from '../../../hooks/useWorkout';

export default function TrainingHistory() {
  const navigate = useNavigate();
  const { history, loading, error, fetchHistory, deleteHistoryItem } = useWorkout();
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filtered = history.filter((h) => h.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6 max-w-[430px] mx-auto w-full">
        {/* Header & Search */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">Performance Logs</p>
            <h2 className="text-2xl font-extrabold text-[#e5e2e1]">Workout History</h2>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d1c5ab]/60 text-sm">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search past sessions..."
                className="w-full bg-[#0e0e0e] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-[#e5e2e1] placeholder:text-[#d1c5ab]/40 focus:border-[#f5c400] outline-none"
              />
            </div>
            <button onClick={() => navigate('/workout/log')} className="px-3 rounded-xl border border-[#f5c400]/20 bg-[#f5c400]/10 text-[#f5c400] text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-sm">add</span> Manual
            </button>
          </div>
        </motion.section>

        {loading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <span className="material-symbols-outlined text-[#f5c400] text-xl animate-spin">autorenew</span>
            <span className="text-xs text-[#d1c5ab]">Loading workout logs...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <span className="material-symbols-outlined text-3xl text-[#d1c5ab]/40">history</span>
            <p className="text-xs text-[#d1c5ab]">No completed workout sessions found.</p>
          </div>
        )}

        {/* List of Sessions */}
        <div className="space-y-3">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx }}
              className="p-5 rounded-xl border border-white/10 bg-[#201f1f] space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#d1c5ab]/60 uppercase tracking-wider">
                    {new Date(item.createdAt).toLocaleDateString()} • {Math.round(item.durationSeconds / 60)} min
                  </span>
                  <h3 className="text-base font-bold text-[#e5e2e1]">{item.title}</h3>
                </div>
                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="text-[#d1c5ab]/40 hover:text-red-400 transition-colors text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 text-center font-[JetBrains_Mono,monospace]">
                <div className="bg-[#131313] p-2 rounded-lg">
                  <span className="text-[9px] text-[#d1c5ab] font-bold block uppercase">VOLUME</span>
                  <span className="text-xs font-bold text-[#f5c400]">{item.totalVolumeKg}kg</span>
                </div>
                <div className="bg-[#131313] p-2 rounded-lg">
                  <span className="text-[9px] text-[#d1c5ab] font-bold block uppercase">CALORIES</span>
                  <span className="text-xs font-bold text-[#f5c400]">{item.caloriesBurned} kcal</span>
                </div>
                <div className="bg-[#131313] p-2 rounded-lg">
                  <span className="text-[9px] text-[#d1c5ab] font-bold block uppercase">RPE</span>
                  <span className="text-xs font-bold text-[#f5c400]">{item.rpeAvg}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav activeId="home" />
    </div>
  );
}
