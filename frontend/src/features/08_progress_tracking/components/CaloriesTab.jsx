import { useState } from 'react';
import SyncStatus from './calories/SyncStatus';
import CalorieRing from './calories/CalorieRing';
import MacroCard from './calories/MacroCard';
import MealCard from './calories/MealCard';

export default function CaloriesTab({
  nutritionSubView,
  setNutritionSubView,
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
  handleDeleteMeal,
  limitCalories = 2400,
  targetProtein = 180,
  targetCarbs = 250,
  targetFat = 70,
  lastSyncTime
}) {
  const [dateOffset, setDateOffset] = useState(0);

  const getDateLabel = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    if (offset === 0) return `Today, ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    if (offset === -1) return `Yesterday, ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    if (offset === 1) return `Tomorrow, ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Dynamic nutrition calculations from logged meals array
  const consumedCalories = loggedMeals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0);
  const currentProtein = loggedMeals.reduce((acc, m) => acc + (Number(m.protein) || 0), 0);
  const currentCarbs = loggedMeals.reduce((acc, m) => acc + (Number(m.carbs) || 0), 0);
  const currentFat = loggedMeals.reduce((acc, m) => acc + (Number(m.fat) || 0), 0);
  const currentFiber = loggedMeals.reduce((acc, m) => acc + (Number(m.fiber) || 0), 0);

  const MEAL_CATEGORIES = [
    { type: 'Breakfast', icon: 'wb_sunny' },
    { type: 'Lunch', icon: 'restaurant' },
    { type: 'Dinner', icon: 'dark_mode' },
    { type: 'Snack', icon: 'cookie' }
  ];

  return (
    <div className="w-full max-w-[430px] mx-auto animate-in fade-in duration-300">
      {/* SUBVIEW A: DAILY NUTRITION DASHBOARD */}
      {nutritionSubView === 'dashboard' && (
        <div className="flex flex-col w-full space-y-6 pt-4">
          {/* Title & Dynamic Date Switcher Header */}
          <div className="px-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-label-caps text-primary uppercase tracking-[0.2em] font-bold">Daily Nutrition</span>
              <SyncStatus isLoading={isMealsLoading} isError={Boolean(mealsError)} lastSyncTime={lastSyncTime} />
            </div>

            {/* Date Switcher */}
            <div className="flex items-center justify-between bg-surface-container px-4 py-2 rounded-2xl border border-white/5">
              <button
                onClick={() => setDateOffset((prev) => prev - 1)}
                className="text-on-surface-variant hover:text-white p-1 cursor-pointer transition-colors"
                title="Previous Day"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <h2 className="text-sm font-bold text-on-surface tracking-wide">{getDateLabel(dateOffset)}</h2>
              <button
                onClick={() => setDateOffset((prev) => prev + 1)}
                disabled={dateOffset >= 0}
                className="text-on-surface-variant hover:text-white p-1 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next Day"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Main Calorie Progress Ring */}
          <CalorieRing
            consumedCalories={consumedCalories}
            targetCalories={limitCalories}
            onLogClick={() => setNutritionSubView('tracker')}
          />

          {/* Macronutrients Grid */}
          <div className="px-6 grid grid-cols-1 gap-3">
            <MacroCard label="Protein" currentGrams={currentProtein} targetGrams={targetProtein} unit="g" color="#F5C400" />
            <MacroCard label="Carbs" currentGrams={currentCarbs} targetGrams={targetCarbs} unit="g" color="#F5C400" />
            <MacroCard label="Fat" currentGrams={currentFat} targetGrams={targetFat} unit="g" color="#F5C400" />
            {currentFiber > 0 && (
              <MacroCard label="Dietary Fiber" currentGrams={currentFiber} targetGrams={35} unit="g" color="#4ADE80" />
            )}
          </div>

          {/* Meal Breakdown Timeline */}
          <div className="px-6 flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-label-caps text-on-surface-variant tracking-widest uppercase font-bold">Today's Meal Log</h3>
              <button 
                onClick={() => setNutritionSubView('tracker')}
                className="text-[10px] font-bold text-primary hover:text-white transition-colors flex items-center gap-1 cursor-pointer bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20"
              >
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                ADD MEAL
              </button>
            </div>

            <div className="space-y-3">
              {isMealsLoading && (
                <div className="flex items-center justify-center py-8 gap-2 bg-surface-container rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-primary text-xl animate-spin">autorenew</span>
                  <span className="text-xs text-on-surface-variant font-medium">Fetching nutrition log...</span>
                </div>
              )}

              {!isMealsLoading && mealsError && (
                <div className="text-center py-6 bg-red-500/10 rounded-2xl border border-red-500/20 p-4">
                  <p className="text-xs text-red-400">{mealsError}</p>
                </div>
              )}

              {!isMealsLoading && !mealsError && loggedMeals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center bg-surface-container rounded-2xl border border-white/5 p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-2xl">no_meals</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">No meals logged today</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Tap <strong>+ ADD MEAL</strong> to calculate & log your macros.</p>
                  </div>
                  <button
                    onClick={() => setNutritionSubView('tracker')}
                    className="mt-2 px-5 py-2 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:brightness-105 transition-all"
                  >
                    + Add First Meal
                  </button>
                </div>
              )}

              {!isMealsLoading && loggedMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
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
            <div className="flex items-center justify-between">
              <span className="text-label-caps text-primary uppercase tracking-[0.2em] font-bold">AI Calorie Estimator</span>
              <button
                onClick={() => setNutritionSubView('dashboard')}
                className="text-xs text-on-surface-variant hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span> Dashboard
              </button>
            </div>
            <h2 className="text-2xl font-extrabold text-on-surface mt-1">AI Meal Tracker</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Describe what you ate in natural language, and FITAI will calculate exact calories and macros.
            </p>
          </header>

          {/* Meal Input Section */}
          <section className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative bg-surface-container-low rounded-[24px] p-4 flex flex-col gap-4 border border-white/5 overflow-hidden">
              <textarea 
                value={mealInput}
                onChange={(e) => setMealInput(e.target.value)}
                className="w-full bg-surface-container-lowest border border-white/10 rounded-xl p-4 font-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none h-32 focus:outline-none text-xs" 
                placeholder="Example: 2 chapatis, 1 bowl chicken curry, 100g white rice..."
              ></textarea>

              {/* Redesigned Meal Category Chip Pills */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-on-surface-variant/80 uppercase tracking-wider pl-1">
                  Meal Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {MEAL_CATEGORIES.map((cat) => {
                    const isActive = mealType === cat.type;
                    return (
                      <button
                        key={cat.type}
                        type="button"
                        onClick={() => setMealType(cat.type)}
                        className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                          isActive
                            ? 'bg-[#f5c400] border-[#f5c400] text-black shadow-md shadow-[#f5c400]/20'
                            : 'bg-[#161616] border-white/10 text-on-surface-variant hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{cat.icon}</span>
                        <span>{cat.type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={handleAnalyzeMeal}
                disabled={isAnalyzingMeal || !mealInput.trim()}
                className="w-full bg-primary hover:brightness-105 text-black font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/10 cursor-pointer disabled:opacity-50 mt-1"
              >
                <span className={`material-symbols-outlined text-[20px] ${isAnalyzingMeal ? 'animate-spin' : ''}`}>
                  {isAnalyzingMeal ? 'autorenew' : 'auto_awesome'}
                </span>
                {isAnalyzingMeal ? 'ANALYZING MEAL...' : 'ANALYZE MEAL WITH AI'}
              </button>
            </div>
          </section>

          {/* Results Section */}
          {analysisResult && (
            <section className="flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-end justify-between border-b border-white/5 pb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Calculated Nutrition</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-data-lg text-[40px] leading-none text-on-surface font-[JetBrains_Mono,monospace] font-bold">{analysisResult.calories}</span>
                    <span className="text-xs text-on-surface-variant font-bold uppercase">kcal</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center ring-1 ring-white/10">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              
              {/* Macros Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">egg_alt</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Protein</span>
                  </div>
                  <span className="font-data-lg text-lg text-on-surface font-[JetBrains_Mono,monospace]">{analysisResult.protein}g</span>
                </div>
                <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">bakery_dining</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Carbs</span>
                  </div>
                  <span className="font-data-lg text-lg text-on-surface font-[JetBrains_Mono,monospace]">{analysisResult.carbs}g</span>
                </div>
                <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">nutrition</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Fat</span>
                  </div>
                  <span className="font-data-lg text-lg text-on-surface font-[JetBrains_Mono,monospace]">{analysisResult.fat}g</span>
                </div>
                <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Fiber</span>
                  </div>
                  <span className="font-data-lg text-lg text-on-surface font-[JetBrains_Mono,monospace]">{analysisResult.fiber || 6}g</span>
                </div>
              </div>

              {/* Log Action Button */}
              <button
                onClick={handleAddMealToLog}
                className="w-full bg-primary text-black font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
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
