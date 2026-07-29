import React, { useEffect, useState } from 'react';
import { TopAppBar } from '../../components/TopAppBar';
import { BottomNavBar } from '../../components/BottomNavBar';
import { apiClient } from '../../lib/axios';

export function RecoveryAnalysisPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchRecovery() {
      try {
        const res = await apiClient.get('/recovery/analysis');
        setData(res.data);
      } catch (err) {
        setData({
          recoveryScore: 92,
          stateStatus: 'Optimum State',
          sleepHours: '7h 45m',
          sleepChange: '+12% vs avg',
          stressLevel: 'Low',
          stressScore: 14,
          hrv: 88,
          insights: [
            {
              id: '1',
              title: 'Fueling Recommendation',
              icon: 'restaurant',
              description: 'Your glycogen levels are stabilized. Prioritize magnesium-rich foods tonight.',
            },
            {
              id: '2',
              title: 'Optimized Schedule',
              icon: 'fitness_center',
              description: 'Recovery score is peak. You are cleared for High Intensity Intervals at 09:00 tomorrow.',
            },
          ],
        });
      }
    }
    fetchRecovery();
  }, []);

  const d = data || {
    recoveryScore: 92,
    stateStatus: 'Optimum State',
    sleepHours: '7h 45m',
    sleepChange: '+12% vs avg',
    stressLevel: 'Low',
    stressScore: 14,
    hrv: 88,
    insights: [],
  };

  return (
    <div className="font-body-md text-body-md overflow-x-hidden pb-32 bg-background text-on-surface min-h-screen">
      <TopAppBar />

      <main className="pt-24 px-container-margin space-y-lg max-w-4xl mx-auto">
        {/* Recovery Score Dial */}
        <section className="flex flex-col items-center py-xl">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="recovery-dial-svg w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-white/5" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="6"></circle>
              <circle
                className="text-primary transition-all duration-1000"
                cx="50"
                cy="50"
                fill="transparent"
                r="45"
                stroke="currentColor"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * (d.recoveryScore || 92)) / 100}
                strokeLinecap="round"
                strokeWidth="6"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-widest mb-1">
                Recovery Score
              </span>
              <span className="font-data-lg text-6xl text-primary-fixed-dim">{d.recoveryScore}</span>
              <span className="text-tertiary-fixed font-data-sm text-data-sm mt-1">{d.stateStatus}</span>
            </div>
          </div>
        </section>

        {/* Body Recovery Map */}
        <section className="glass-card rounded-xxl p-lg relative overflow-hidden">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Body Map</h2>
              <p className="text-on-surface-variant font-body-md opacity-70">Muscle readiness overview</p>
            </div>
            <div className="bg-surface-container-lowest px-md py-sm rounded-full flex items-center gap-2 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_rgba(245,196,0,0.6)]"></span>
              <span className="font-data-sm text-data-sm text-on-surface">Peak Readiness</span>
            </div>
          </div>
          <div className="flex justify-center py-xl relative">
            <div
              className="w-full max-w-xs aspect-[1/2] relative bg-no-repeat bg-contain bg-center opacity-90"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCsIwFR9E1eppFEtsw-SKLmvXLcZK0E5dzzjraQ0aMfgdSjYXFUu-Z7tBWDf_zi2-VTbsVxVfZwuBjsYlnRXF915OD72shipJ6tBDabgTiP-BgxgR3eMn7J-tiEIYesXXcCw4F-G2AxrHTvFvvG6aXtfeEiieIqRBk0Xpco3zPW_X5kQhmcSMrRM6SF7W1JaHT_cKyhdlzgI-mbb_DrOOlb_b_Tdhs1IHN_eQ79TAcGNZcxG7A1zB9Rg')",
              }}
            >
              <div className="absolute top-[20%] left-[40%] w-4 h-4 bg-primary-container rounded-full animate-ping"></div>
              <div className="absolute top-[45%] left-[25%] w-5 h-5 bg-primary-container rounded-full animate-ping"></div>
              <div className="absolute top-[45%] right-[25%] w-5 h-5 bg-primary-container rounded-full animate-ping"></div>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 gap-md">
          <div className="glass-card rounded-xl p-lg space-y-sm">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">bedtime</span>
              <span className="font-label-caps text-label-caps">Sleep</span>
            </div>
            <div className="font-data-lg text-data-lg text-secondary">{d.sleepHours}</div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
              <span className="text-primary-fixed-dim text-[11px] font-bold">{d.sleepChange}</span>
            </div>
          </div>

          <div className="glass-card rounded-xl p-lg space-y-sm">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">psychology</span>
              <span className="font-label-caps text-label-caps">Stress</span>
            </div>
            <div className="font-data-lg text-data-lg text-secondary">{d.stressLevel}</div>
            <div className="px-sm py-1 bg-primary/10 rounded-full w-fit">
              <span className="text-primary text-[11px] font-bold">{d.stressScore}/100</span>
            </div>
          </div>

          <div className="glass-card rounded-xl p-lg col-span-2 flex justify-between items-center">
            <div className="space-y-sm">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">favorite</span>
                <span className="font-label-caps text-label-caps">HRV (Heart Rate Var)</span>
              </div>
              <div className="font-data-lg text-data-lg text-secondary">{d.hrv} ms</div>
            </div>
            <div className="h-12 w-24 flex items-end gap-1 px-sm">
              <div className="w-1.5 h-[60%] bg-white/10 rounded-t-sm"></div>
              <div className="w-1.5 h-[70%] bg-white/10 rounded-t-sm"></div>
              <div className="w-1.5 h-[85%] bg-primary/40 rounded-t-sm"></div>
              <div className="w-1.5 h-[100%] bg-primary rounded-t-sm"></div>
              <div className="w-1.5 h-[75%] bg-primary/40 rounded-t-sm"></div>
            </div>
          </div>
        </section>

        {/* AI Insights */}
        <section className="space-y-lg pb-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">AI Insights</h2>
          </div>
          {d.insights?.map((ins, i) => (
            <div key={ins.id || i} className="glass-card rounded-xxl p-lg border border-primary/20 relative">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-2xl">{ins.icon || 'star'}</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-lg mb-1">{ins.title}</h3>
                  <p className="text-on-surface-variant font-body-md leading-relaxed opacity-90">{ins.description}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
