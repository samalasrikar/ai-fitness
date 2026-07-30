import { useState, useEffect } from 'react';
import { progressApi } from '../../shared/services/progress.api';

export default function RecordsTab() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    let isMounted = true;
    progressApi.getDashboardMetrics()
      .then(res => {
        if (isMounted && res.data) {
          setMetrics(res.data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError('Could not load records. Please try again later.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-in fade-in duration-300">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">autorenew</span>
        <p className="text-xs text-on-surface-variant font-medium">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
        <span className="material-symbols-outlined text-error text-4xl">error_outline</span>
        <p className="text-sm font-bold text-error">Failed to load records</p>
        <p className="text-xs text-on-surface-variant">{error}</p>
      </div>
    );
  }

  const streak = metrics?.activeStreak ?? metrics?.streakDays ?? 14;
  const energyVal = metrics?.energy ?? 2450;

  return (
    <div className="flex flex-col w-full px-6 space-y-6 pt-6 pb-24 animate-in fade-in duration-300">
      {/* Header Section */}
      <header className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-display-lg-mobile font-bold text-on-surface">Personal Fitness Record</h2>
          <p className="text-xs text-on-surface-variant max-w-xl">Your complete fitness journey powered by AI insights.</p>
          <div className="flex gap-2 pt-2">
            <span className="bg-surface-container px-3 py-1 rounded-full border border-white/5 text-[10px] font-bold text-primary">Level 42</span>
            <span className="bg-surface-container px-3 py-1 rounded-full border border-white/5 text-[10px] font-bold text-on-surface-variant">Elite Tier</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="glass-card w-full px-3 py-2 rounded-xl flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
              <span className="text-xs text-on-surface">Timeframe</span>
            </div>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none text-xs text-on-surface focus:outline-none focus:ring-0 cursor-pointer p-0 pr-4 text-right"
            >
              <option value="2024" className="bg-[#121212]">Current Year: 2024</option>
              <option value="all" className="bg-[#121212]">Full History</option>
            </select>
          </div>
        </div>
      </header>

      {/* Fitness Score Circle Card */}
      <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
        <h3 className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">FITNESS SCORE</h3>
        
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="88" cy="88" fill="transparent" r="76" stroke="rgba(255,255,255,0.03)" strokeWidth="8"></circle>
            <circle 
              className="drop-shadow-[0_0_10px_rgba(245,196,0,0.4)]" 
              cx="88" 
              cy="88" 
              fill="transparent" 
              r="76" 
              stroke="#f5c400" 
              strokeDasharray="477" 
              strokeDashoffset="71" 
              strokeLinecap="round" 
              strokeWidth="8"
            ></circle>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold text-primary text-glow">85</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">/ 100</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-bold text-on-surface uppercase tracking-wider">ELITE PERFORMANCE</p>
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>+4.2% from last month</span>
          </div>
        </div>
      </div>

      {/* Consistency Heatmap Card */}
      <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <h4 className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase text-center">CONSISTENCY HEATMAP</h4>
          <div className="mt-4 grid grid-cols-7 gap-2">
            <div className="aspect-square bg-primary rounded-sm shadow-[0_0_8px_rgba(245,196,0,0.5)] cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary/80 rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-surface-container rounded-sm border border-white/5 cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary/60 rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary rounded-sm shadow-[0_0_8px_rgba(245,196,0,0.5)] cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary/90 rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary/40 rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary/30 rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary rounded-sm shadow-[0_0_8px_rgba(245,196,0,0.5)] cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary/80 rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary/90 rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary/20 rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-surface-container rounded-sm cursor-pointer active:scale-90 transition-transform"></div>
            <div className="aspect-square bg-primary rounded-sm shadow-[0_0_8px_rgba(245,196,0,0.5)] cursor-pointer active:scale-90 transition-transform"></div>
          </div>
        </div>
        <div className="bg-primary/5 p-3.5 rounded-xl border border-primary/20 mt-6">
          <p className="text-[11px] font-bold text-primary flex items-center gap-1.5 justify-center">
            <span className="material-symbols-outlined text-xs">psychology</span>
            AI Pattern: Wednesday Mastery
          </p>
          <p className="text-[10px] text-on-surface-variant mt-1.5 leading-normal text-center">
            Highest performance recorded on Wednesdays (Avg Intensity: 94%).
          </p>
        </div>
      </div>

      {/* Vitals Quick Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">WEEKLY VOLUME</p>
            <p className="text-data-lg text-white">12,450 <span className="text-[10px] font-bold text-on-surface-variant">kg</span></p>
          </div>
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-base">fitness_center</span>
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">ACTIVE CALORIES</p>
            <p className="text-data-lg text-white">{energyVal * 2} <span className="text-[10px] font-bold text-on-surface-variant">kcal</span></p>
          </div>
          <div className="w-9 h-9 bg-[#fad100]/10 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#fad100] text-base font-bold">bolt</span>
          </div>
        </div>

        <div className="col-span-2 glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-primary border-white/5">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">CURRENT STREAK</p>
            <p className="text-data-lg text-white">{streak} <span className="text-[10px] font-bold text-on-surface-variant">Days</span></p>
          </div>
          <span className="material-symbols-outlined text-primary text-2xl animate-pulse">local_fire_department</span>
        </div>
      </div>

      {/* Weight Progress Chart Card */}
      <div className="glass-card rounded-3xl p-6 overflow-hidden relative border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-sm font-bold text-on-surface">Weight Progress</h4>
            <p className="text-[11px] text-on-surface-variant">Real-time tracking with AI prediction line.</p>
          </div>
          <div className="flex bg-surface-container rounded-lg p-0.5 border border-white/5 text-[10px] font-bold">
            <button className="bg-surface-container-high px-2.5 py-1 rounded text-on-surface">6M</button>
            <button className="px-2.5 py-1 rounded text-on-surface-variant">1Y</button>
          </div>
        </div>
        <div className="h-44 flex items-end justify-between gap-2 relative mt-4">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
            <path d="M0,180 L100,170 L200,175 L300,160 L400,155 L500,140 L600,135 L700,120" fill="none" stroke="#f5c400" strokeLinecap="round" strokeWidth="4"></path>
            <path d="M700,120 L800,105 L900,95 L1000,80" fill="none" opacity="0.4" stroke="#f5c400" strokeDasharray="8,8" strokeWidth="4"></path>
            <linearGradient id="chart-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f5c400" stopOpacity="0.2"></stop>
              <stop offset="100%" stopColor="#f5c400" stopOpacity="0"></stop>
            </linearGradient>
            <path d="M0,180 L100,170 L200,175 L300,160 L400,155 L500,140 L600,135 L700,120 V200 H0 Z" fill="url(#chart-grad)"></path>
          </svg>
          <div className="absolute left-[70%] top-[45%] flex flex-col items-center">
            <div className="w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-primary/20"></div>
            <div className="mt-1.5 bg-primary text-black font-bold text-[10px] px-2 py-0.5 rounded shadow-xl">78.5 kg</div>
          </div>
        </div>
      </div>

      {/* Strength Radar Card */}
      <div className="glass-card rounded-3xl p-6 flex flex-col items-center border border-white/5 justify-between">
        <h4 className="text-sm font-bold text-on-surface self-start">Strength Radar</h4>
        <div className="relative w-44 h-44 flex items-center justify-center mt-6">
          <div className="absolute inset-2 radar-chart bg-white/5 border border-white/10 scale-100"></div>
          <div className="absolute inset-2 radar-chart bg-white/5 border border-white/10 scale-75"></div>
          <div className="absolute inset-2 radar-chart bg-white/5 border border-white/10 scale-50"></div>
          <div className="absolute inset-2 radar-chart bg-primary/20 border-2 border-primary" style={{ clipPath: 'polygon(50% 10%, 90% 45%, 70% 90%, 30% 90%, 10% 45%)' }}></div>
          
          <span className="absolute top-0 text-[8px] font-bold text-on-surface-variant">STRENGTH</span>
          <span className="absolute bottom-0 left-1 text-[8px] font-bold text-on-surface-variant">BALANCE</span>
          <span className="absolute bottom-0 right-1 text-[8px] font-bold text-on-surface-variant">RECOVERY</span>
          <span className="absolute top-1/2 -left-6 -translate-y-1/2 text-[8px] font-bold text-on-surface-variant -rotate-90">MOBILITY</span>
          <span className="absolute top-1/2 -right-6 -translate-y-1/2 text-[8px] font-bold text-on-surface-variant rotate-90">ENDURANCE</span>
        </div>
      </div>

      {/* Nutrition Rings Card */}
      <div className="glass-card rounded-3xl p-6 flex flex-col border border-white/5 justify-between">
        <h4 className="text-sm font-bold text-on-surface">Nutrition Rings</h4>
        <div className="relative w-36 h-36 mx-auto mt-4">
          {/* Protein Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="72" cy="72" fill="transparent" r="62" stroke="rgba(255,255,255,0.03)" strokeWidth="8"></circle>
            <circle cx="72" cy="72" fill="transparent" r="62" stroke="#f5c400" strokeDasharray="390" strokeDashoffset="97" strokeLinecap="round" strokeWidth="8"></circle>
          </svg>
          {/* Carbs Ring */}
          <svg className="absolute inset-0 w-full h-full p-4 transform -rotate-90">
            <circle cx="56" cy="56" fill="transparent" r="46" stroke="rgba(255,255,255,0.03)" strokeWidth="8"></circle>
            <circle cx="56" cy="56" fill="transparent" r="46" stroke="#a78bfa" strokeDasharray="290" strokeDashoffset="139" strokeLinecap="round" strokeWidth="8"></circle>
          </svg>
          {/* Fats Ring */}
          <svg className="absolute inset-0 w-full h-full p-8 transform -rotate-90">
            <circle cx="40" cy="40" fill="transparent" r="30" stroke="rgba(255,255,255,0.03)" strokeWidth="8"></circle>
            <circle cx="40" cy="40" fill="transparent" r="30" stroke="#34d399" strokeDasharray="188" strokeDashoffset="94" strokeLinecap="round" strokeWidth="8"></circle>
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="text-center">
            <p className="text-primary font-data-sm text-xs font-bold">Prot</p>
            <p className="text-[10px] text-on-surface-variant font-bold">75%</p>
          </div>
          <div className="text-center">
            <p className="text-violet-400 font-data-sm text-xs font-bold">Carb</p>
            <p className="text-[10px] text-on-surface-variant font-bold">52%</p>
          </div>
          <div className="text-center">
            <p className="text-emerald-400 font-data-sm text-xs font-bold">Fats</p>
            <p className="text-[10px] text-on-surface-variant font-bold">50%</p>
          </div>
        </div>
      </div>

      {/* AI Insight Cards */}
      <div className="flex flex-col gap-4">
        <div className="glass-card rounded-2xl p-4 flex gap-3 items-start bg-primary/5 border border-primary/10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-black font-bold">bedtime</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Sleep Optimization</p>
            <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
              Increasing sleep above 7.5h tonight is predicted to increase training quality by <span className="text-primary font-bold">22%</span> tomorrow.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex gap-3 items-start bg-violet-500/5 border border-violet-500/10">
          <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white font-bold">water_drop</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Hydration Alert</p>
            <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
              Current hydration levels are <span className="text-violet-400 font-bold">12% below optimal</span> for your high-intensity session planned.
            </p>
          </div>
        </div>
      </div>

      {/* Workout History */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Workout History</h3>
          <div className="flex bg-surface-container rounded-full p-0.5 border border-white/5 text-[9px] font-bold">
            <button className="px-3 py-1 rounded-full bg-primary text-black transition-all">Week</button>
            <button className="px-3 py-1 rounded-full text-on-surface-variant hover:text-on-surface">Month</button>
          </div>
        </div>
        <div className="space-y-4 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/5">
          {/* Timeline Item 1 */}
          <div className="relative pl-10 group">
            <div className="absolute left-[18px] top-6 w-1.5 h-1.5 bg-primary rounded-full ring-4 ring-primary/20 z-10"></div>
            <div className="glass-card rounded-2xl p-4 group-hover:bg-white/5 transition-all flex justify-between items-center gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX2ZWqglvE8jLVVpuXu6bMMqddeGzbuaCFujSWn-uy-0AMhWhFZ6qUqjYqpY3aoH8fCpD2ZCuximIHL-FnCZ1XhsQn4O1LkdGBy8VQQk4lPJJSsyWl9UXz7fbAi1REzpRTf7sqxIz3MU2AcVq1PKZ1Xgood2TfrhqRu0cW3iGuj_mpYOtqT3gvIAYsQTZiLMMMyxNz3WASUUjpP_lWeSLRtom7xmQeaUB2XOGZbUy_GxmdaR3On9kFEw" alt="Squat" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">TUESDAY, OCT 24 • 8:30 AM</p>
                  <h5 className="text-xs font-bold text-on-surface">Power & Hypertrophy Lower</h5>
                  <div className="flex gap-3 pt-1 text-[9px] text-on-surface-variant">
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">schedule</span> 72m</span>
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">local_fire_department</span> 842 kcal</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">AI RATING</p>
                  <p className="text-lg font-bold text-primary text-glow">A+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative pl-10 group">
            <div className="absolute left-[18px] top-6 w-1.5 h-1.5 bg-white/20 rounded-full z-10"></div>
            <div className="glass-card rounded-2xl p-4 group-hover:bg-white/5 transition-all flex justify-between items-center gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHyKUR3QQfnuKBxt03lR1u4T9W75ZpMnCWFVGRRU78C0gL1i_F6M5AeFaZelpaYwg2mcwztXtMkqogt2R2nTdqogySR1NX8fWKmnpeKOX9nMEbQkPcajgAvHh-Ln6w4-F_T0VnNLruiSMqm650TVo91aACOlRzPLL-hgYVUKbTL6hYVkNvdfGmpBqa6WKZKliMtlK52WrZ9i1vThJnq8z--wXrw0LFpoMDeWVu__-RcziRkYjBokMopg" alt="Stretches" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">MONDAY, OCT 23 • 6:45 PM</p>
                  <h5 className="text-xs font-bold text-on-surface">Active Recovery & Mobility</h5>
                  <div className="flex gap-3 pt-1 text-[9px] text-on-surface-variant">
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">schedule</span> 35m</span>
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">local_fire_department</span> 210 kcal</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">AI RATING</p>
                  <p className="text-lg font-bold text-on-surface-variant">B</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Records & Badges */}
      <section className="flex flex-col gap-6">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Milestones & Records</h3>
          <div className="space-y-3">
            <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/5">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <div className="flex-1">
                <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">SQUAT PERSONAL RECORD</p>
                <h6 className="text-sm font-bold text-on-surface">145.0 kg</h6>
                <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">new_releases</span> New PR set 2 days ago
                </p>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/5">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant">history</span>
              </div>
              <div className="flex-1">
                <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">DEADLIFT PERSONAL RECORD</p>
                <h6 className="text-sm font-bold text-on-surface">182.5 kg</h6>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Set on Sept 15, 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Vault */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Achievement Vault</h3>
          <div className="grid grid-cols-4 gap-3">
            {['local_fire_department', 'calendar_month', 'diamond', 'military_tech', 'workspace_premium', 'stars', 'psychology', 'fitness_center'].map((badge, idx) => (
              <div key={idx} className={`aspect-square glass-card rounded-xl flex items-center justify-center group hover:border-primary/50 transition-all cursor-pointer ${idx < 3 ? 'border-primary/20' : 'opacity-30 grayscale'}`}>
                <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: idx < 3 ? "'FILL' 1" : "'FILL' 0" }}>{badge}</span>
              </div>
            ))}
          </div>
          <div className="p-4 glass-card rounded-xl border border-primary/20 mt-3">
            <p className="text-xs font-bold text-primary">Next Milestone: 30 Day Streak</p>
            <div className="w-full bg-white/5 h-1 rounded-full mt-2">
              <div className="bg-primary h-full rounded-full w-[46%] shadow-[0_0_8px_rgba(245,196,0,0.4)]"></div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1.5">14/30 days completed. Keep it up!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
