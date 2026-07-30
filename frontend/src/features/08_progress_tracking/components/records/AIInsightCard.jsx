export default function AIInsightCard({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-surface-container p-5 rounded-2xl border border-primary/20 space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            AI Performance Analytics
          </span>
        </div>
        <span className="text-[9px] font-bold text-on-surface-variant uppercase bg-white/5 px-2 py-0.5 rounded-full">
          Neural Core 4.0
        </span>
      </div>

      <ul className="space-y-2 text-xs text-on-surface-variant">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-2 leading-relaxed">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
