import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAnalytics } from '../../../hooks/useAnalytics';

export default function PerformanceLab() {
  const navigate = useNavigate();
  const { performanceLabData, loading, error, fetchPerformanceLab } = useAnalytics();

  useEffect(() => {
    fetchPerformanceLab();
  }, [fetchPerformanceLab]);

  const lab = performanceLabData || {
    readinessScore: 85,
    hrvTrendMs: [
      { date: 'Mon', hrv: 72 },
      { date: 'Tue', hrv: 75 },
      { date: 'Wed', hrv: 71 },
      { date: 'Thu', hrv: 80 },
      { date: 'Fri', hrv: 78 },
      { date: 'Sat', hrv: 82 },
      { date: 'Sun', hrv: 78 },
    ],
    sleepHoursTrend: [
      { date: 'Mon', hours: 7.5 },
      { date: 'Tue', hours: 8.0 },
      { date: 'Wed', hours: 7.2 },
      { date: 'Thu', hours: 8.5 },
      { date: 'Fri', hours: 8.1 },
      { date: 'Sat', hours: 9.0 },
      { date: 'Sun', hours: 8.5 },
    ],
    cnsRecoveryStatus: 'Optimal (Green)',
    volumeCapacity: 88,
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-[#f5c400] tracking-tight font-[Manrope]">Performance Lab</h1>
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
            <span className="text-xs text-[#d1c5ab]">Loading lab biometrics...</span>
          </div>
        )}

        <section className="rounded-xl p-5 border border-white/10 bg-[#201f1f] space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-wider">CNS & HRV Recovery</span>
            <span className="text-xs font-bold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{lab.cnsRecoveryStatus}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#131313] rounded-lg border border-white/5">
              <span className="text-[9px] text-[#d1c5ab] font-bold uppercase tracking-wider block mb-1">Readiness Score</span>
              <p className="text-2xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{lab.readinessScore}%</p>
            </div>
            <div className="p-3 bg-[#131313] rounded-lg border border-white/5">
              <span className="text-[9px] text-[#d1c5ab] font-bold uppercase tracking-wider block mb-1">Volume Capacity</span>
              <p className="text-2xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{lab.volumeCapacity}%</p>
            </div>
          </div>
        </section>

        {/* HRV Trend Chart */}
        <section className="rounded-xl p-5 border border-white/10 bg-[#201f1f] space-y-3">
          <h3 className="text-xs font-bold text-[#f5c400] uppercase tracking-wider">7-Day HRV Baseline (ms)</h3>
          <div className="h-36 flex items-end justify-between gap-2 pt-4">
            {lab.hrvTrendMs.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#f5c400] rounded-t" style={{ height: `${(item.hrv / 100) * 100}%` }} />
                <span className="text-[9px] text-[#d1c5ab] font-bold">{item.date}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeId="home" />
    </div>
  );
}
