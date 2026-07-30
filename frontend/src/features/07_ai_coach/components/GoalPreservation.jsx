import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAnalytics } from '../../../hooks/useAnalytics';

export default function GoalPreservation() {
  const navigate = useNavigate();
  const { goalDriftData, loading, error, fetchGoalDrift } = useAnalytics();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    fetchGoalDrift();
  }, [fetchGoalDrift]);

  const data = goalDriftData || {
    goalName: 'Hypertrophy & 15% Body Fat Target',
    targetDate: '2026-10-31',
    progressPercentage: 68,
    projectedCompletionDate: '2026-11-08',
    driftDays: 8,
    recommendation: 'Increase protein intake by 15g daily and append 1 extra work set on lower body compound days to re-align with target date.',
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-[#f5c400] tracking-tight font-[Manrope]">Goal Preservation</h1>
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
            <span className="text-xs text-[#d1c5ab]">Calculating goal drift metrics...</span>
          </div>
        )}

        <div className="rounded-xl p-5 border border-white/10 bg-[#201f1f] space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-wider">Goal Realignment</span>
            <span className="text-xs font-bold font-[JetBrains_Mono,monospace] bg-[#f5c400]/10 text-[#f5c400] px-3 py-1 rounded-full">
              {data.progressPercentage}% Progress
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#e5e2e1]">{data.goalName}</h2>

          <div className="grid grid-cols-2 gap-3 py-2 border-y border-white/5">
            <div>
              <span className="text-[9px] text-[#d1c5ab] uppercase font-bold tracking-wider block">Target Date</span>
              <p className="text-xs font-bold text-[#e5e2e1] mt-0.5">{data.targetDate}</p>
            </div>
            <div>
              <span className="text-[9px] text-[#d1c5ab] uppercase font-bold tracking-wider block">Projected Finish</span>
              <p className="text-xs font-bold text-[#f5c400] mt-0.5">{data.projectedCompletionDate} (+{data.driftDays}d drift)</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f5c400]/5 border border-[#f5c400]/20 space-y-2">
            <h4 className="text-xs font-bold text-[#f5c400] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              AI Micro-Adjustment Protocol
            </h4>
            <p className="text-xs text-[#d1c5ab] leading-relaxed">{data.recommendation}</p>
          </div>

          <button
            onClick={() => {
              setAccepted(true);
              setTimeout(() => setAccepted(false), 3000);
            }}
            className="w-full py-4 bg-[#f5c400] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            {accepted ? '✓ Micro-Adjustment Applied to Routine' : 'Accept Goal Realignment Protocol'}
          </button>
        </div>
      </main>

      <BottomNav activeId="home" />
    </div>
  );
}
