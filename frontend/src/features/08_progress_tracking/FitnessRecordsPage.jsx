import React, { useEffect, useState } from 'react';
import { TopAppBar } from '../../components/TopAppBar';
import { BottomNavBar } from '../../components/BottomNavBar';
import { apiClient } from '../../lib/axios';

export function FitnessRecordsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const res = await apiClient.get('/records');
        setData(res.data);
      } catch (err) {
        setData({
          user: { eliteRankScore: 750, percentile: 'top 2%' },
          records: [
            { id: '1', title: 'Deadlift Max', subtitle: 'New Personal Best', value: '215', unit: 'KG', timeAgo: '2 DAYS AGO' },
            { id: '2', title: '5K Run', subtitle: 'Speed Improvement', value: '19:42', unit: 'MIN', timeAgo: 'YESTERDAY' },
            { id: '3', title: '30 Day Streak', subtitle: 'Perfect Consistency', value: '30', unit: 'DAYS', timeAgo: 'JUST NOW' },
          ],
        });
      }
    }
    fetchRecords();
  }, []);

  const score = data?.user?.eliteRankScore || 750;
  const records = data?.records || [];

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <TopAppBar />

      <main className="pt-xxxl pb-32 px-container-margin max-w-4xl mx-auto space-y-lg">
        {/* Hero Score */}
        <section className="mt-lg">
          <div className="glass-card rounded-3xl p-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest block mb-xs">
                OVERALL ELITE RANK
              </span>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-display-lg text-primary-container">{score}</span>
                <span className="font-headline-md text-headline-md text-primary-container/60">/ 1000</span>
              </div>
              <p className="text-body-md text-on-surface-variant max-w-[240px] mt-sm">
                You're in the top 2% of athletes this month. Keep pushing.
              </p>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Strength Radar Chart */}
          <div className="glass-card rounded-3xl p-lg flex flex-col items-center">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant self-start mb-lg">STRENGTH PROFILE</h3>
            <div className="w-full aspect-square relative flex items-center justify-center">
              <svg className="w-4/5 h-4/5" viewBox="0 0 200 200">
                <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></polygon>
                <polygon points="100,40 160,70 160,130 100,160 40,130 40,70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></polygon>
                <polygon points="100,35 170,65 150,135 100,170 50,130 35,75" fill="rgba(245, 196, 0, 0.15)" stroke="#F5C400" strokeWidth="2"></polygon>
                <text x="100" y="15" className="fill-on-surface-variant font-label-caps text-[8px]" textAnchor="middle">POWER</text>
                <text x="190" y="60" className="fill-on-surface-variant font-label-caps text-[8px]" textAnchor="start">ENDUR</text>
                <text x="190" y="145" className="fill-on-surface-variant font-label-caps text-[8px]" textAnchor="start">AGIL</text>
                <text x="100" y="195" className="fill-on-surface-variant font-label-caps text-[8px]" textAnchor="middle">RECOV</text>
                <text x="10" y="145" className="fill-on-surface-variant font-label-caps text-[8px]" textAnchor="end">FLEX</text>
                <text x="10" y="60" className="fill-on-surface-variant font-label-caps text-[8px]" textAnchor="end">SPEED</text>
              </svg>
            </div>
          </div>

          {/* Consistency Grid */}
          <div className="glass-card rounded-3xl p-lg">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-lg">CONSISTENCY SCORE</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 42 }).map((_, i) => {
                const active = i % 3 !== 0;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${
                      active ? (i % 2 === 0 ? 'bg-primary-container' : 'bg-primary-container/50') : 'bg-white/5'
                    }`}
                  ></div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PR List */}
        <section className="space-y-md">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant px-xs">RECENT ACHIEVEMENTS</h3>
          {records.map((rec) => (
            <div key={rec.id} className="glass-card rounded-2xl p-md flex items-center justify-between group hover:bg-white/5 transition-all">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined">fitness_center</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-on-surface font-bold">{rec.title}</h4>
                  <p className="text-body-md text-on-surface-variant">{rec.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-data-lg text-data-lg text-primary">
                  {rec.value} <span className="text-sm">{rec.unit}</span>
                </div>
                <div className="text-[10px] font-label-caps text-on-surface-variant">{rec.timeAgo}</div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
