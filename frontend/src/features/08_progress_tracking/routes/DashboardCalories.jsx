import { useOutletContext, useNavigate } from 'react-router-dom';
import CaloriesTab from '../components/CaloriesTab';

export default function DashboardCalories() {
  const state = useOutletContext();
  const navigate = useNavigate();

  return (
    <CaloriesTab
      nutritionSubView="dashboard"
      setNutritionSubView={(sub) => {
        if (sub === 'tracker') navigate('/dashboard/meal-ai');
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
      handleAddMealToLog={state.handleAddMealToLog}
      handleDeleteMeal={state.handleDeleteMeal}
      limitCalories={state.limitCalories}
      lastSyncTime={state.lastSyncTime}
    />
  );
}
