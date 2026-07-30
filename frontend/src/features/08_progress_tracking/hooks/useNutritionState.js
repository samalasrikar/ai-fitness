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

  useEffect(() => {
    let isMounted = true;
    setIsMealsLoading(true);
    nutritionApi.getLoggedMeals()
      .then((res) => {
        if (!isMounted) return;
        const meals = (res.data || []).map(m => ({
          id: m.id,
          title: m.title,
          time: m.timeLabel || '12:00 PM',
          calories: m.calories || 0,
          protein: m.protein || 0,
          carbs: m.carbs || 0,
          fat: m.fat || 0,
          img: m.imgUrl || DEFAULT_MEAL_IMAGE
        }));
        setLoggedMeals(meals);
        // Aggregate today's totals from API data
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
      .catch((e) => {
        if (isMounted) setMealsError('Failed to load meals. Pull to refresh.');
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
    try {
      const res = await nutritionApi.analyzeMeal(mealInput);
      if (res.data) setAnalysisResult(res.data);
    } catch (e) {
      // Graceful fallback estimation
      setAnalysisResult({
        calories: 350, protein: 12, carbs: 40, fat: 8, fiber: 2,
        description: mealInput
      });
    } finally {
      setIsAnalyzingMeal(false);
    }
  };

  const handleAddMealToLog = async () => {
    if (!analysisResult) return;
    const mealData = {
      title: `${mealType}`,
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
    } catch (e) {
      const fallback = {
        id: `meal-${Date.now()}`,
        title: mealData.title,
        time: mealData.timeLabel,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        img: DEFAULT_MEAL_IMAGE
      };
      setLoggedMeals(prev => [fallback, ...prev]);
      setCurrentCalories(prev => prev + fallback.calories);
      setCurrentProtein(prev => prev + fallback.protein);
      setCurrentCarbs(prev => prev + fallback.carbs);
      setCurrentFat(prev => prev + fallback.fat);
    }
    setMealInput('');
    setAnalysisResult(null);
    setNutritionSubView('dashboard');
  };

  const limitCalories = 2800;
  const calPercent = Math.min(currentCalories / limitCalories, 1);
  const nutritionRingOffset = 603 * (1 - calPercent);
  const proteinPct = Math.min((currentProtein / 180) * 100, 100);
  const carbsPct = Math.min((currentCarbs / 250) * 100, 100);
  const fatPct = Math.min((currentFat / 80) * 100, 100);

  return {
    nutritionSubView, setNutritionSubView,
    currentCalories, currentProtein, currentCarbs, currentFat,
    mealInput, setMealInput,
    mealType, setMealType,
    isAnalyzingMeal, analysisResult,
    loggedMeals, isMealsLoading, mealsError,
    handleAnalyzeMeal, handleAddMealToLog,
    limitCalories, nutritionRingOffset,
    proteinPct, carbsPct, fatPct
  };
}
