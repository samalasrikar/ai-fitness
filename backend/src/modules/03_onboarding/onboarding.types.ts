export interface OnboardingDTO {
  gender?: string;
  age?: number;
  weight?: number;
  heightFt?: number;
  heightIn?: number;
  fitnessLevel?: string;
  frequency?: string;
  location?: string;
  duration?: string;
  selectedGoal?: string;
  isCompleted?: boolean;
}

export interface OnboardingRecord extends OnboardingDTO {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
