import { DEFAULT_MEAL_IMAGE } from '../constants/dashboardConstants';

const todayLabel = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

export default function CaloriesTab({
  nutritionSubView,
  setNutritionSubView,
  currentCalories,
  currentProtein,
  currentCarbs,
  currentFat,
  mealInput,
  setMealInput,
  mealType,
  setMealType,
  isAnalyzingMeal,
  analysisResult,
  loggedMeals,
  isMealsLoading,
  mealsError,
  handleAnalyzeMeal,
  handleAddMealToLog,
  limitCalories,
  nutritionRingOffset,
  proteinPct,
  carbsPct,
  fatPct
}) {
  return (
    <div className="animate-in fade-in duration-300">
      {/* SUBVIEW A: DAILY NUTRITION DASHBOARD */}
      {nutritionSubView === 'dashboard' && (
        <div className="flex flex-col w-full space-y-6 pt-4">
          {/* Title Header */}
          <div className="px-6 flex flex-col gap-1">
            <span className="text-label-caps text-primary uppercase tracking-[0.2em] font-bold">Daily Summary</span>
            <div className="flex items-center justify-between">
              <h2 className="text-headline-md text-on-surface">Today, {todayLabel}</h2>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full">
                <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                <span className="text-[9px] font-label-caps text-on-surface-variant font-bold">AI SYNCED</span>
              </div>
            </div>
          </div>

          {/* Main Progress Ring */}
          <div className="relative flex items-center justify-center py-6">
            <svg className="w-56 h-56 transform -rotate-90">
              <circle className="text-surface-container-high" cx="112" cy="112" fill="transparent" r="96" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="drop-shadow-[0_0_12px_rgba(245,196,0,0.3)] transition-all duration-1000" 
                cx="112" 
                cy="112" 
                fill="transparent" 
                r="96" 
                stroke="#F5C400" 
                strokeDasharray="603" 
                style={{ strokeDashoffset: nutritionRingOffset }}
                strokeLinecap="round" 
                strokeWidth="12"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-data-lg text-[28px] text-primary">{currentCalories.toLocaleString()}</span>
              <span className="font-label-caps text-on-surface-variant text-[11px] -mt-1 font-bold">/ {limitCalories.toLocaleString()} KCAL</span>
              <button 
                onClick={() => setNutritionSubView('tracker')}
                className="mt-4 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full font-bold text-xs text-primary transition-colors cursor-pointer"
              >
                {currentCalories < limitCalories ? `${limitCalories - currentCalories} kcal left` : 'Goal Met! Log More'}
              </button>
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="px-6 grid grid-cols-1 gap-4">
            {/* Protein */}
            <div className="bg-surface-container p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">PROTEIN</span>
                <span className="font-data-sm text-[12px] text-on-surface">
                  <span className="text-primary font-bold">{currentProtein}g</span> / 180g
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${proteinPct}%` }}></div>
              </div>
            </div>
            {/* Carbs */}
            <div className="bg-surface-container p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">CARBS</span>
                <span className="font-data-sm text-[12px] text-on-surface">
                  <span className="text-primary font-bold">{currentCarbs}g</span> / 250g
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${carbsPct}%` }}></div>
              </div>
            </div>
            {/* Fat */}
            <div className="bg-surface-container p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">FAT</span>
                <span className="font-data-sm text-[12px] text-on-surface">
                  <span className="text-primary font-bold">{currentFat}g</span> / 80g
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${fatPct}%` }}></div>
              </div>
            </div>
          </div>

          {/* Meal Timeline */}
          <div className="px-6 flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-label-caps text-on-surface-variant tracking-widest uppercase font-bold">Meal Log</h3>
              <button 
                onClick={() => setNutritionSubView('tracker')}
                className="text-[10px] font-bold text-primary hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                ADD MEAL
              </button>
            </div>

            <div className="space-y-3">
              {isMealsLoading && (
                <div className="flex items-center justify-center py-8 gap-2">
                  <span className="material-symbols-outlined text-primary text-xl animate-spin">autorenew</span>
                  <span className="text-xs text-on-surface-variant">Loading meals...</span>
                </div>
              )}
              {!isMealsLoading && mealsError && (
                <div className="text-center py-6">
                  <p className="text-xs text-error">{mealsError}</p>
                </div>
              )}
              {!isMealsLoading && !mealsError && loggedMeals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-3xl">no_meals</span>
                  <p className="text-xs text-on-surface-variant">No meals logged today. Tap <strong>+ ADD MEAL</strong> to start tracking.</p>
                </div>
              )}
              {!isMealsLoading && loggedMeals.map((meal) => (
                <div key={meal.id} className="flex items-center gap-4 bg-surface-container p-4 rounded-xl border border-white/5">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-bright flex-shrink-0">
                    <img
                      alt={meal.title}
                      className="w-full h-full object-cover"
                      src={meal.img}
                      onError={(e) => { e.currentTarget.src = DEFAULT_MEAL_IMAGE; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-on-surface truncate">{meal.title}</h4>
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs">
                      <span className="font-data-sm text-primary">{meal.calories} kcal</span>
                      <span className="font-data-sm text-on-surface-variant">P: {meal.protein}g / C: {meal.carbs}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW B: AI MEAL CALORIE TRACKER */}
      {nutritionSubView === 'tracker' && (
        <div className="flex flex-col w-full space-y-6 pt-4 px-6 mb-6">
          {/* Header title */}
          <header className="flex flex-col gap-1">
            <h2 className="text-display-lg-mobile font-bold text-on-surface">AI Meal Tracker</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Type what you ate, and AI will instantly calculate your nutrition metrics.
            </p>
          </header>

          {/* Meal Input Section */}
          <section className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-container/20 to-transparent blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative bg-surface-container-low rounded-[24px] p-4 flex flex-col gap-4 border border-white/5 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <textarea 
                value={mealInput}
                onChange={(e) => setMealInput(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-xl p-4 font-body-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all resize-none h-32 focus:outline-none" 
                placeholder="Example: 2 chapatis, 1 bowl dal, grilled chicken..."
              ></textarea>
              <div className="flex gap-3">
                <div className="flex-1 bg-surface-container-highest/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary-container">restaurant_menu</span>
                  <select 
                    value={mealType} 
                    onChange={(e) => setMealType(e.target.value)}
                    className="bg-transparent border-none text-on-surface font-label-caps text-[10px] uppercase tracking-wider w-full focus:ring-0 focus:outline-none cursor-pointer"
                  >
                    <option className="bg-surface-container-high text-on-surface" value="Breakfast">Breakfast</option>
                    <option className="bg-surface-container-high text-on-surface" value="Lunch">Lunch</option>
                    <option className="bg-surface-container-high text-on-surface" value="Dinner">Dinner</option>
                    <option className="bg-surface-container-high text-on-surface" value="Snack">Snack</option>
                  </select>
                </div>
                <div className="flex-1 bg-surface-container-highest/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary-container">schedule</span>
                  <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface">12:30 PM</span>
                </div>
              </div>
              <button 
                onClick={handleAnalyzeMeal}
                disabled={isAnalyzingMeal || !mealInput.trim()}
                className="w-full bg-primary hover:bg-primary-fixed-dim text-black font-bold text-xs tracking-widest uppercase py-4 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary-container/10 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[20px] ${isAnalyzingMeal ? 'animate-spin' : ''}`}>
                  {isAnalyzingMeal ? 'autorenew' : 'temp_preferences_custom'}
                </span>
                {isAnalyzingMeal ? 'ANALYZING...' : 'ANALYZE MEAL'}
              </button>
            </div>
          </section>

          {/* Results Section */}
          {analysisResult && (
            <section className="flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-end justify-between border-b border-white/5 pb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Analysis Result</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-data-lg text-[40px] leading-none text-on-surface">{analysisResult.calories}</span>
                    <span className="text-xs text-on-surface-variant font-bold uppercase">kcal</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center ring-1 ring-white/10">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </div>
              </div>
              
              {/* Macros Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">egg_alt</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Protein</span>
                  </div>
                  <span className="font-data-lg text-lg text-on-surface">{analysisResult.protein}g</span>
                </div>
                <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">bakery_dining</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Carbs</span>
                  </div>
                  <span className="font-data-lg text-lg text-on-surface">{analysisResult.carbs}g</span>
                </div>
                <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">nutrition</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Fat</span>
                  </div>
                  <span className="font-data-lg text-lg text-on-surface">{analysisResult.fat}g</span>
                </div>
                <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Fiber</span>
                  </div>
                  <span className="font-data-lg text-lg text-on-surface">{analysisResult.fiber}g</span>
                </div>
              </div>

              {/* Log Action Button */}
              <button
                onClick={handleAddMealToLog}
                className="w-full bg-white text-black font-bold text-xs tracking-widest uppercase py-3.5 mt-2 rounded-full transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                LOG MEAL INTO DIET
              </button>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
