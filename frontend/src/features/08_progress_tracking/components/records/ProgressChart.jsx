export default function ProgressChart({ chartData }) {
  if (!chartData || chartData.length === 0) return null;

  const maxVolume = Math.max(...chartData.map((d) => d.volume || 1), 30000);

  return (
    <div className="bg-surface-container p-5 rounded-2xl border border-white/5 space-y-4">
      <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Volume Trend</span>
          <h4 className="text-xs font-bold text-on-surface">Monthly Tonnage Progression</h4>
        </div>
        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          +44% Growth
        </span>
      </div>

      {/* SVG Bar Chart */}
      <div className="flex items-end justify-between h-32 pt-4 px-2 gap-4">
        {chartData.map((item, idx) => {
          const heightPct = Math.min(Math.round((item.volume / maxVolume) * 100), 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity font-[JetBrains_Mono,monospace]">
                {(item.volume / 1000).toFixed(1)}k
              </span>
              <div className="w-full bg-surface-container-high rounded-xl h-full flex items-end overflow-hidden">
                <div
                  className="w-full bg-[#f5c400] rounded-xl transition-all duration-1000 group-hover:brightness-110 shadow-[0_0_12px_rgba(245,196,0,0.2)]"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
