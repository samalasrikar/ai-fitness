export const DEFAULT_MEAL_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';

// INITIAL_MEALS removed — meals now load from the backend via nutritionApi.getLoggedMeals()
export const INITIAL_MEALS = [];

export const DEFAULT_USER_PROFILE = {
  displayName: '',
  username: '',
  fitnessLevel: 'Beginner',
  weight: 0,
  heightFt: 0,
  heightIn: 0,
  age: 0
};

export const PROFILE_GOALS_OPTIONS = [
  'Muscle Gain',
  'Strength Training',
  'Weight Loss',
  'Fat Loss',
  'Endurance'
];

export const AI_PREFERENCES_CONFIG = [
  { key: 'workoutGen', label: 'AI Workout Generation', desc: 'Real-time progressive load adjustments' },
  { key: 'nutritionInsights', label: 'Nutrition Insights', desc: 'Smart macronutrient profile balancing' },
  { key: 'recoveryAnalysis', label: 'Recovery Analysis', desc: 'Wearables, Sleep & HRV synchronization' }
];
