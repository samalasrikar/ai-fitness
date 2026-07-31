import React from 'react';
import { useAIRecommendations } from '../hooks/useAIRecommendations';

export default function AIRecommendationsSection() {
  const { recommendations, isLoading, error } = useAIRecommendations();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-surface-container/40 rounded-3xl border border-white/5 p-6">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">auto_awesome</span>
        <p className="text-xs text-on-surface-variant font-semibold">Generating personalized AI workout insights...</p>
      </div>
    );
  }

  if (error || !recommendations) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-bold text-center">
        ⚠️ Failed to load AI recommendations.
      </div>
    );
  }

  const priorityStyles = {
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Low: 'bg-primary/20 text-primary border-primary/30',
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Neural Insights</span>
          <h3 className="text-xl font-extrabold text-white">AI Recommendations & Alerts</h3>
        </div>
        <span className="text-xs font-bold text-on-surface-variant bg-surface-bright px-3 py-1 rounded-full border border-white/10 w-max">
          {recommendations.length} Active Insights
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-5 bg-surface-container/90 border border-white/10 hover:border-primary/40 rounded-3xl space-y-3 shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">{rec.type}</span>
                <h4 className="text-base font-black text-white">{rec.title}</h4>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase shrink-0 ${priorityStyles[rec.priority] || priorityStyles.Medium}`}>
                {rec.priority} Priority
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-surface-bright/50 rounded-xl border border-white/5">
                <span className="text-[10px] font-extrabold text-primary uppercase block mb-0.5">Biomechanical Reason</span>
                <p className="text-white/80 leading-relaxed">{rec.reason}</p>
              </div>

              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <span className="text-[10px] font-extrabold text-primary uppercase block mb-0.5">Recommended Action</span>
                <p className="text-white font-bold leading-relaxed">{rec.recommendedAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
