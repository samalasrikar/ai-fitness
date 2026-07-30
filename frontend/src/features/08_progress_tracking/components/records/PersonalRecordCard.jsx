export default function PersonalRecordCard({ record, onDelete }) {
  return (
    <div className="bg-surface-container p-4 rounded-2xl border border-white/5 space-y-3 relative group hover:border-white/10 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[9px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            {record.category || 'Strength'}
          </span>
          <h4 className="text-sm font-bold text-on-surface mt-1.5">{record.exerciseName}</h4>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(record.id)}
            className="text-on-surface-variant hover:text-red-400 p-1 cursor-pointer transition-colors"
            title="Delete PR"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        )}
      </div>

      <div className="flex items-baseline justify-between pt-1 border-t border-white/5 font-[JetBrains_Mono,monospace]">
        <div>
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">Personal Best</span>
          <span className="text-2xl font-bold text-primary">{record.recordValue} <span className="text-xs font-normal">{record.unit || 'kg'}</span></span>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">{record.improvement || '+5 kg'}</span>
          <span className="text-[10px] text-on-surface-variant font-medium">Prev: {record.previousBest || Math.round(record.recordValue * 0.92)}{record.unit || 'kg'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-on-surface-variant/70 pt-1 border-t border-white/5">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-xs text-primary">emoji_events</span>
          {record.daysAgo === 0 ? 'Achieved Today' : `${record.daysAgo} days ago`}
        </span>
        <span>Verified by FITAI</span>
      </div>
    </div>
  );
}
