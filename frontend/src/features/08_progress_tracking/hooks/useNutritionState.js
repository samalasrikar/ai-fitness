import { useState, useEffect } from 'react';
import { DEFAULT_MEAL_IMAGE } from '../constants/dashboardConstants';
import { nutritionApi } from '../../shared/services/nutrition.api';

export function useNutritionState() {
  const [nutritionSubView, setNutritionSubView] = useState('dashboard');
  const [currentCalories, setCurrentCalories] = useState(0);
  const [currentProtein, setCurrentProtein] = useState(0);
  const [currentCarbs, setCurrentCarbs] = useState(0);
  const [currentFat, setCurrentFat] = useState(0);

  const [mealInput, setMealInput] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [isMealsLoading, setIsMealsLoading] = useState(true);
  const [mealsError, setMealsError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsMealsLoading(true);
    nutritionApi.getLoggedMeals()
      .then((res) => {
        if (!isMounted) return;
        const meals = (res.data || []).map(m => ({
          id: m.id,
          title: m.title,
          mealType: m.mealType || 'Meal',
          time: m.timeLabel || '12:00 PM',
          calories: m.calories || 0,
          protein: m.protein || 0,
          carbs: m.carbs || 0,
          fat: m.fat || 0,
          img: m.imgUrl || DEFAULT_MEAL_IMAGE
        }));
        setLoggedMeals(meals);
        setLastSyncTime(new Date().toISOString());

        const totals = meals.reduce((acc, m) => ({
          cal: acc.cal + (m.calories || 0),
          pro: acc.pro + (m.protein || 0),
          carb: acc.carb + (m.carbs || 0),
          fat: acc.fat + (m.fat || 0)
        }), { cal: 0, pro: 0, carb: 0, fat: 0 });

        setCurrentCalories(totals.cal);
        setCurrentProtein(totals.pro);
        setCurrentCarbs(totals.carb);
        setCurrentFat(totals.fat);
      })
      .catch(() => {
        if (isMounted) {
          setLoggedMeals([]);
          setMealsError(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsMealsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleAnalyzeMeal = async () => {
    if (!mealInput.trim()) return;
    setIsAnalyzingMeal(true);
    setAnalysisResult(null);
    setMealsError(null);
    try {
      const res = await nutritionApi.analyzeMeal(mealInput);
      const data = res.data?.data || res.data;
      if (data) setAnalysisResult(data);
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || 'AI Meal Analysis failed.';
      setMealsError(errorMsg);
    } finally {
      setIsAnalyzingMeal(false);
    }
  };

  const handleAddMealToLog = async () => {
    if (!analysisResult) return;
    const mealData = {
      title: `${mealInput.trim().slice(0, 24) || mealType}`,
      mealType,
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fat: analysisResult.fat,
      imgUrl: DEFAULT_MEAL_IMAGE
    };
    try {
      const res = await nutritionApi.logMeal(mealData);
      const saved = res.data;
      const newMeal = {
        id: saved?.id || `meal-${Date.now()}`,
        title: saved?.title || mealData.title,
        mealType: saved?.mealType || mealData.mealType,
        time: saved?.timeLabel || mealData.timeLabel,
        calories: saved?.calories ?? mealData.calories,
        protein: saved?.protein ?? mealData.protein,
        carbs: saved?.carbs ?? mealData.carbs,
        fat: saved?.fat ?? mealData.fat,
        img: saved?.imgUrl || DEFAULT_MEAL_IMAGE
      };
      setLoggedMeals(prev => [newMeal, ...prev]);
      setCurrentCalories(prev => prev + newMeal.calories);
      setCurrentProtein(prev => prev + newMeal.protein);
      setCurrentCarbs(prev => prev + newMeal.carbs);
      setCurrentFat(prev => prev + newMeal.fat);
      setLastSyncTime(new Date().toISOString());
    } catch (e) {
      // Re-throw error so UI knows save failed
      setMealsError('Failed to log meal to backend database.');
    }
    setMealInput('');
    setAnalysisResult(null);
    setNutritionSubView('dashboard');
  };

  const handleDeleteMeal = async (id) => {
    try {
      await nutritionApi.deleteMeal(id);
    } catch (e) {}
    setLoggedMeals(prev => prev.filter(m => m.id !== id));
    setLastSyncTime(new Date().toISOString());
  };

  const limitCalories = 2400;

  return {
    nutritionSubView, setNutritionSubView,
    currentCalories, currentProtein, currentCarbs, currentFat,
    mealInput, setMealInput,
    mealType, setMealType,
    isAnalyzingMeal, analysisResult,
    loggedMeals, isMealsLoading, mealsError,
    handleAnalyzeMeal, handleAddMealToLog, handleDeleteMeal,
    limitCalories, lastSyncTime
  };
}
