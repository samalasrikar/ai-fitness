export interface Exercise {
  id: string;
  name: string;
  category: string;
  targetMuscle: string;
  equipment: string;
  difficulty: string;
  instructions: string[];
  formCues: string[];
  imageUrl?: string;
}

export interface ExerciseAlternative {
  id: string;
  name: string;
  matchScore: number;
  reason: string;
  mechanicalTension: number; // out of 10
  fatigueImpact: string; // Low, Medium, High
  targetMuscle: string;
  equipment: string;
  imgSrc?: string;
}
