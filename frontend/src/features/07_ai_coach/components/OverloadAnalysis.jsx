import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useAnalytics } from '../../../hooks/useAnalytics';

export default function OverloadAnalysis() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('Weekly');
  const { overloadData, loading, error, fetchOverloadAnalysis } = useAnalytics();

  useEffect(() => {
    fetchOverloadAnalysis();
  }, [fetchOverloadAnalysis]);

  const weekly = overloadData?.weeklyVolumeProgress || [
    { week: 'W1', volumeKg: 12400 },
    { week: 'W2', volumeKg: 13800 },
    { week: 'W3', volumeKg: 14200 },
    { week: 'W4', volumeKg: 9800 },
    { week: 'W5', volumeKg: 15600 },
    { week: 'W6', volumeKg: 16850 },
  ];

  const maxVol = Math.max(...weekly.map((w) => w.volumeKg), 18000);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-[#f5c400] tracking-tight font-[Manrope]">Overload Analysis</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6 max-w-[430px] mx-auto w-full">
        {loading && (
          <div className="flex items-center justify-center py-6 gap-2">
            <span className="material-symbols-outlined text-[#f5c400] text-xl animate-spin">autorenew</span>
            <span className="text-xs text-[#d1c5ab]">Analyzing progressive volume load...</span>
          </div>
        )}

        {/* Timeframe Filter Selector (Weekly / Monthly / Yearly) */}
        <div className="flex items-center justify-between bg-[#201f1f] p-1.5 rounded-xl border border-white/10">
          {['Weekly', 'Monthly', 'Yearly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf
                  ? 'bg-[#f5c400] text-black shadow-[0_0_10px_rgba(245,196,0,0.3)]'
                  : 'text-[#d1c5ab]/60 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Volume Chart Bar */}
        <section className="rounded-xl p-5 border border-white/10 bg-[#201f1f] space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-wider">{timeframe} Volume Load (kg)</span>
            <span className="text-xs font-bold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">+14.2% YoY</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
            {weekly.map((w, i) => {
              const hPct = Math.round((w.volumeKg / maxVol) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-[#131313] rounded-t-lg relative flex items-end overflow-hidden h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${hPct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * i }}
                      className="w-full bg-gradient-to-t from-[#f5c400]/40 to-[#f5c400] rounded-t-lg"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-[#d1c5ab] uppercase">{w.week}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Exercise Progression Table */}
        <section className="rounded-xl p-5 border border-white/10 bg-[#201f1f] space-y-3">
          <h3 className="text-xs font-bold text-[#f5c400] uppercase tracking-wider">Exercise Progression Trends ({timeframe})</h3>
          <div className="space-y-2">
            {(overloadData?.exerciseProgression || [
              { name: 'Barbell Back Squat', startWeight: 100, currentWeight: 125, percentageIncrease: 25 },
              { name: 'Bench Press', startWeight: 80, currentWeight: 105, percentageIncrease: 31.2 },
              { name: 'Romanian Deadlift', startWeight: 110, currentWeight: 140, percentageIncrease: 27.2 },
            ]).map((ex) => (
              <div key={ex.name} className="p-3 rounded-lg bg-[#131313] border border-white/5 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-[#e5e2e1]">{ex.name}</h4>
                  <p className="text-[10px] text-[#d1c5ab] font-[JetBrains_Mono,monospace]">
                    {ex.startWeight}kg → <span className="text-[#f5c400] font-bold">{ex.currentWeight}kg</span>
                  </p>
                </div>
                <span className="text-xs font-bold text-[#f5c400] bg-[#f5c400]/10 px-2.5 py-1 rounded-full border border-[#f5c400]/20 font-[JetBrains_Mono,monospace]">
                  +{ex.percentageIncrease}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* AI Workout Recommendations (Module 4) */}
        <section className="rounded-xl p-5 border border-[#f5c400]/30 bg-[#201f1f] space-y-3">
          <div className="flex items-center gap-2 text-[#f5c400]">
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <h3 className="text-xs font-bold uppercase tracking-wider">AI Workout Recommendations</h3>
          </div>
          <div className="space-y-2">
            {[
              'Train chest tomorrow to balance push/pull volume ratio.',
              'Maintain 90s rest interval between heavy compound work sets.',
              'Schedule an active recovery day in 48 hours for optimal CNS reset.',
            ].map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-[#131313] border border-white/5 text-xs text-[#e5e2e1]">
                <span className="material-symbols-outlined text-[#f5c400] text-sm mt-0.5">check_circle</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeId="home" />
    </div>
  );
}
