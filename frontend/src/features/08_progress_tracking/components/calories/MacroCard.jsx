export default function MacroCard({ label, currentGrams, targetGrams, unit = 'g', color = '#F5C400' }) {
  const current = Math.max(0, currentGrams || 0);
  const target = targetGrams || 100;
  const pct = Math.min(Math.round((current / target) * 100), 100);

  return (
    <div className="bg-surface-container p-4 rounded-xl border border-white/5 space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">{label}</span>
        <span className="font-data-sm text-[12px] text-on-surface font-[JetBrains_Mono,monospace]">
          <span className="text-primary font-bold">{current}{unit}</span> / {target}{unit}
        </span>
      </div>
      <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
