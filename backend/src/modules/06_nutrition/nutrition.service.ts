import { NutritionRepository } from './nutrition.repository';
import { MealLogItem, MealAnalysisResult } from './nutrition.types';

export class NutritionService {
  private readonly repo = new NutritionRepository();

  public async getLoggedMeals(userId: string): Promise<MealLogItem[]> {
    return this.repo.getMealsByUserId(userId);
  }

  public async analyzeMeal(mealText: string): Promise<MealAnalysisResult> {
    let cals = 350;
    let p = 12;
    let c = 40;
    let f = 8;
    let fib = 2;

    const lowerInput = mealText.toLowerCase();
    if (lowerInput.includes('chicken') || lowerInput.includes('egg') || lowerInput.includes('meat') || lowerInput.includes('fish')) {
      cals = 540;
      p = 45;
      c = 15;
      f = 14;
    } else if (lowerInput.includes('rice') || lowerInput.includes('roti') || lowerInput.includes('chapati') || lowerInput.includes('bread')) {
      cals = 480;
      p = 8;
      c = 85;
      f = 4;
    } else if (lowerInput.includes('shake') || lowerInput.includes('whey') || lowerInput.includes('protein')) {
      cals = 220;
      p = 30;
      c = 6;
      f = 3;
    } else if (lowerInput.includes('salad') || lowerInput.includes('vegetable') || lowerInput.includes('fruit')) {
      cals = 180;
      p = 4;
      c = 28;
      f = 2;
      fib = 8;
    }

    return {
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      description: mealText
    };
  }

  public async logMeal(userId: string, meal: MealLogItem): Promise<MealLogItem> {
    return this.repo.createMealLog(userId, meal);
  }
}
