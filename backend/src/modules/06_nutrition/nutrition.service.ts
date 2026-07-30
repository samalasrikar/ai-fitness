import { NutritionRepository } from './nutrition.repository';
import { MealLogItem, MealAnalysisResult } from './nutrition.types';
import { AIService } from '../../utils/ai.service';
import { ApiError } from '../../utils/ApiError';

export class NutritionService {
  private readonly repo = new NutritionRepository();

  public async getLoggedMeals(userId: string): Promise<MealLogItem[]> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    return this.repo.getMealsByUserId(userId);
  }

  public async getSummary(userId: string) {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    const meals = await this.getLoggedMeals(userId);
    const totals = meals.reduce(
      (acc, m) => {
        acc.calories += Number(m.calories ? m.calories : 0);
        acc.protein += Number(m.protein ? m.protein : 0);
        acc.carbs += Number(m.carbs ? m.carbs : 0);
        acc.fat += Number(m.fat ? m.fat : 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      targetCalories: 2400,
      targetProtein: 180,
      targetCarbs: 250,
      targetFat: 70,
      consumedCalories: totals.calories,
      consumedProtein: totals.protein,
      consumedCarbs: totals.carbs,
      consumedFat: totals.fat,
      meals,
    };
  }

  /**
   * Natural language AI meal analysis via OpenRouter Generative AI LLM
   */
  public async analyzeMeal(mealText: string): Promise<MealAnalysisResult> {
    if (!mealText || mealText.trim() === '') {
      throw ApiError.badRequest('Meal text is required.');
    }
    return AIService.analyzeMealWithAI(mealText);
  }

  public async getRecommendations(context?: any) {
    return AIService.generateNutritionRecommendationsWithAI(context);
  }

  public async generateMealPlan(input: any) {
    if (!input.goal || String(input.goal).trim() === '') {
      throw ApiError.badRequest('Goal is required.');
    }
    if (input.targetCalories === undefined || input.targetCalories === null || isNaN(Number(input.targetCalories))) {
      throw ApiError.badRequest('Target calories are required.');
    }
    return AIService.generateMealPlanFromCriteria(input);
  }

  public async logMeal(userId: string, meal: MealLogItem): Promise<MealLogItem> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!meal.title || String(meal.title).trim() === '') {
      throw ApiError.badRequest('Meal title is required.');
    }
    if (!meal.mealType || String(meal.mealType).trim() === '') {
      throw ApiError.badRequest('Meal type is required.');
    }
    if (meal.calories === undefined || meal.calories === null || isNaN(Number(meal.calories))) {
      throw ApiError.badRequest('Calories are required.');
    }
    if (meal.protein === undefined || meal.protein === null || isNaN(Number(meal.protein))) {
      throw ApiError.badRequest('Protein is required.');
    }
    if (meal.carbs === undefined || meal.carbs === null || isNaN(Number(meal.carbs))) {
      throw ApiError.badRequest('Carbs are required.');
    }
    if (meal.fat === undefined || meal.fat === null || isNaN(Number(meal.fat))) {
      throw ApiError.badRequest('Fat is required.');
    }

    return this.repo.createMealLog(userId, meal);
  }

  public async duplicateMeal(userId: string, id: string): Promise<MealLogItem> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!id) throw ApiError.badRequest('Meal ID is required.');
    const meals = await this.getLoggedMeals(userId);
    const target = meals.find((m) => m.id === id);
    if (!target) {
      throw ApiError.notFound('Meal log not found.');
    }
    return this.logMeal(userId, {
      ...target,
      title: `${target.title} (Copy)`,
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }

  public async deleteMeal(userId: string, id: string): Promise<boolean> {
    if (!userId) throw ApiError.unauthorized('User ID is required.');
    if (!id) throw ApiError.badRequest('Meal ID is required.');
    return this.repo.deleteMealLog(userId, id);
  }
}
