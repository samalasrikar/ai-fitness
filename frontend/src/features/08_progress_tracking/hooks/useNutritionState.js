import { useState, useEffect } from 'react';
import { DEFAULT_MEAL_IMAGE, INITIAL_MEALS } from '../constants/dashboardConstants';
import { nutritionApi } from '../../shared/services/nutrition.api';

export function useNutritionState(addTimer) {
  const [nutritionSubView, setNutritionSubView] = useState('dashboard');
  const [currentCalories, setCurrentCalories] = useState(2450);
  const [currentProtein, setCurrentProtein] = useState(165);
  const [currentCarbs, setCurrentCarbs] = useState(210);
  const [currentFat, setCurrentFat] = useState(65);

  const [mealInput, setMealInput] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loggedMeals, setLoggedMeals] = useState(INITIAL_MEALS);

  useEffect(() => {
    let isMounted = true;
    nutritionApi.getLoggedMeals()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          const apiMeals = res.data.map(m => ({
            id: m.id,
            title: m.title,
            time: m.timeLabel || '12:30 PM',
            calories: m.calories,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fat,
            img: m.imgUrl || DEFAULT_MEAL_IMAGE
          }));
          setLoggedMeals(apiMeals);
        }
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, []);

  const handleAnalyzeMeal = async () => {
    if (!mealInput.trim()) return;
    setIsAnalyzingMeal(true);
    setAnalysisResult(null);

    try {
      const res = await nutritionApi.analyzeMeal(mealInput);
      if (res.data) {
        setAnalysisResult(res.data);
      }
    } catch (e) {
      let cals = 350;
      let p = 12;
      let c = 40;
      let f = 8;
      let fib = 2;
      setAnalysisResult({
        calories: cals,
        protein: p,
        carbs: c,
        fat: f,
        fiber: fib,
        description: mealInput
      });
    } finally {
      setIsAnalyzingMeal(false);
    }
  };

  const handleAddMealToLog = async () => {
    if (!analysisResult) return;

    const mealData = {
      title: `Logged ${mealType}`,
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
        calories: saved?.calories || mealData.calories,
        protein: saved?.protein || mealData.protein,
        carbs: saved?.carbs || mealData.carbs,
        fat: saved?.fat || mealData.fat,
        img: saved?.imgUrl || DEFAULT_MEAL_IMAGE
      };
      setLoggedMeals((prev) => [newMeal, ...prev]);
    } catch (e) {
      const newMeal = {
        id: `meal-${Date.now()}`,
        ...mealData,
        time: mealData.timeLabel,
        img: DEFAULT_MEAL_IMAGE
      };
      setLoggedMeals((prev) => [newMeal, ...prev]);
    }

    setCurrentCalories((prev) => prev + analysisResult.calories);
    setCurrentProtein((prev) => prev + analysisResult.protein);
    setCurrentCarbs((prev) => prev + analysisResult.carbs);
    setCurrentFat((prev) => prev + analysisResult.fat);

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
    handleAnalyzeMeal,
    handleAddMealToLog,
    limitCalories,
    nutritionRingOffset,
    proteinPct,
    carbsPct,
    fatPct
  };
}
