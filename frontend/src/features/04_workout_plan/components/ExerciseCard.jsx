/**
 * ExerciseCard – Individual exercise row for YourAIWorkout / FitAIAssistant.
 *
 * ✅ Equal height via min-h
 * ✅ Exercise title readable, truncated with title attr as tooltip
 * ✅ RPE badge never overlaps text (flex-shrink-0)
 * ✅ Long names handled via truncate + min-w-0
 */
export default function ExerciseCard({ exercise, index, onPress, onSwap }) {
  const { name, sets, reps, rpe, tag, tagColor, imgSrc, note, extra } = exercise;

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`View details for ${name}`}
      className="w-full text-left rounded-xl overflow-hidden
                 bg-[#201f1f] border border-white/8
                 hover:border-[#f5c400]/30 transition-all duration-200
                 active:scale-[0.99] cursor-pointer"
    >
      <div className="flex items-center gap-3 p-4 min-h-[72px]">
        {/* Thumbnail */}
        {imgSrc && (
          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0
                          border border-white/5 bg-[#131313]">
            <img
              className="w-full h-full object-cover"
              src={imgSrc}
              alt={name}
              loading="lazy"
            />
          </div>
        )}

        {/* Text content – min-w-0 prevents overflow */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Name + tag row */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className="text-sm font-bold text-[#e5e2e1] truncate"
              title={name}
            >
              {name}
            </h4>
            {tag && (
              <span
                className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px]
                             font-bold uppercase tracking-wider
                             ${tagColor || 'bg-[#f5c400] text-black'}`}
              >
                {tag}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 flex-wrap">
            <Stat label="Sets" value={sets} />
            {reps && <Stat label="Reps" value={reps} />}
            {rpe != null && (
              <span
                className="flex-shrink-0 text-[10px] font-bold text-black
                           bg-[#f5c400] px-1.5 py-0.5 rounded font-[JetBrains_Mono,monospace]"
              >
                RPE {rpe}
              </span>
            )}
            {extra && (
              <span className="text-[10px] text-[#d1c5ab]/60 font-[JetBrains_Mono,monospace]">
                {extra}
              </span>
            )}
          </div>

          {note && (
            <p className="text-[10px] text-[#ffba38] font-semibold">{note}</p>
          )}
        </div>

        {/* Swap button */}
        {onSwap && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSwap(); }}
            aria-label={`Swap ${name}`}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center
                       rounded-lg text-[#d1c5ab]/40 hover:text-[#f5c400]
                       hover:bg-[#f5c400]/10 transition-colors"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              swap_horiz
            </span>
          </button>
        )}
      </div>
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] font-medium text-[#d1c5ab]/60 uppercase">
        {label}:
      </span>
      <span className="text-[11px] font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">
        {value}
      </span>
    </div>
  );
}
