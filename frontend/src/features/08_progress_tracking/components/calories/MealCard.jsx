import { DEFAULT_MEAL_IMAGE } from '../../constants/dashboardConstants';

export default function MealCard({ meal, onDelete }) {
  return (
    <div className="flex items-center gap-4 bg-surface-container p-4 rounded-xl border border-white/5 group transition-all hover:border-white/10">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-bright flex-shrink-0 border border-white/5">
        <img
          alt={meal.title}
          className="w-full h-full object-cover"
          src={meal.img || DEFAULT_MEAL_IMAGE}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_MEAL_IMAGE;
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">{meal.mealType || 'Meal'}</span>
            <h4 className="text-sm font-bold text-on-surface truncate">{meal.title}</h4>
          </div>
          <div className="flex items-center gap-1">
            {meal.onDuplicate && (
              <button
                onClick={() => meal.onDuplicate(meal.id)}
                className="text-on-surface-variant hover:text-[#f5c400] p-1 transition-colors cursor-pointer"
                title="Duplicate meal log"
              >
                <span className="material-symbols-outlined text-lg">content_copy</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(meal.id)}
                className="text-on-surface-variant hover:text-red-400 p-1 transition-colors cursor-pointer"
                title="Delete meal log"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-1 text-xs font-[JetBrains_Mono,monospace]">
          <span className="text-primary font-bold">{meal.calories} kcal</span>
          <span className="text-on-surface-variant">P: {meal.protein}g / C: {meal.carbs}g / F: {meal.fat}g</span>
        </div>
      </div>
    </div>
  );
}
