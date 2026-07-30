export interface ExerciseItem {
  name: string;
  sets: string;
  rpe: string;
}

export interface WorkoutPlan {
  id?: string;
  userId?: string;
  title: string;
  duration: string;
  exercises: ExerciseItem[];
  isActive?: boolean;
  createdAt?: Date;
}
