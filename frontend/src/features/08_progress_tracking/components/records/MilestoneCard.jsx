export default function MilestoneCard({ milestone }) {
  const { title, current, target, unit, completionPct, estimatedDate } = milestone;

  return (
    <div className="bg-surface-container p-4 rounded-2xl border border-white/5 space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="text-xs font-bold text-on-surface">{title}</h4>
        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Est: {estimatedDate || 'Soon'}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold font-[JetBrains_Mono,monospace]">
          <span className="text-primary">{current.toLocaleString()} {unit}</span>
          <span className="text-on-surface-variant">Target: {target.toLocaleString()} {unit}</span>
        </div>
        <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      <div className="text-right text-[9px] font-bold text-primary uppercase tracking-wider">
        {completionPct}% Completed
      </div>
    </div>
  );
}
