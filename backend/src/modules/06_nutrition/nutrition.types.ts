export interface MealLogItem {
  id?: string;
  userId?: string;
  title: string;
  mealType: string;
  timeLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imgUrl?: string;
  createdAt?: Date;
}

export interface MealAnalysisResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
}
