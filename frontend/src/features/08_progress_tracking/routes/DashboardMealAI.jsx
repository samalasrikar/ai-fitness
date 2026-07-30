import { useOutletContext, useNavigate } from 'react-router-dom';
import CaloriesTab from '../components/CaloriesTab';

export default function DashboardMealAI() {
  const state = useOutletContext();
  const navigate = useNavigate();

  return (
    <CaloriesTab
      nutritionSubView="tracker"
      setNutritionSubView={(sub) => {
        if (sub === 'dashboard') navigate('/dashboard/calories');
      }}
      currentCalories={state.currentCalories}
      currentProtein={state.currentProtein}
      currentCarbs={state.currentCarbs}
      currentFat={state.currentFat}
      mealInput={state.mealInput}
      setMealInput={state.setMealInput}
      mealType={state.mealType}
      setMealType={state.setMealType}
      isAnalyzingMeal={state.isAnalyzingMeal}
      analysisResult={state.analysisResult}
      loggedMeals={state.loggedMeals}
      isMealsLoading={state.isMealsLoading}
      mealsError={state.mealsError}
      handleAnalyzeMeal={state.handleAnalyzeMeal}
      handleAddMealToLog={async () => {
        await state.handleAddMealToLog();
        navigate('/dashboard/calories');
      }}
      handleDeleteMeal={state.handleDeleteMeal}
      limitCalories={state.limitCalories}
      lastSyncTime={state.lastSyncTime}
    />
  );
}
