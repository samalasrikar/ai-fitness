import { db } from '../../config/database';
import { MealLogItem } from './nutrition.types';

export class NutritionRepository {
  public async getMealsByUserId(userId: string): Promise<MealLogItem[]> {
    const result = await db.query(
      'SELECT * FROM meal_logs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      mealType: row.meal_type,
      timeLabel: row.time_label,
      calories: Number(row.calories),
      protein: Number(row.protein),
      carbs: Number(row.carbs),
      fat: Number(row.fat),
      imgUrl: row.img_url,
      createdAt: row.created_at,
    }));
  }

  public async createMealLog(userId: string, meal: Partial<MealLogItem>): Promise<MealLogItem> {
    const result = await db.query(
      `INSERT INTO meal_logs (user_id, title, meal_type, time_label, calories, protein, carbs, fat, img_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId,
        meal.title || 'Logged Meal',
        meal.mealType || 'Lunch',
        meal.timeLabel || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        meal.calories || 0,
        meal.protein || 0,
        meal.carbs || 0,
        meal.fat || 0,
        meal.imgUrl || null,
      ]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      mealType: row.meal_type,
      timeLabel: row.time_label,
      calories: Number(row.calories),
      protein: Number(row.protein),
      carbs: Number(row.carbs),
      fat: Number(row.fat),
      imgUrl: row.img_url,
      createdAt: row.created_at,
    };
  }

  public async deleteMealLog(userId: string, id: string): Promise<boolean> {
    const res = await db.query('DELETE FROM meal_logs WHERE id = $1 AND user_id = $2', [id, userId]);
    return (res.rowCount ?? 0) > 0;
  }
}
