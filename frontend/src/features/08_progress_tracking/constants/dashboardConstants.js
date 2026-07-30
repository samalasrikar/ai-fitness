export const DEFAULT_MEAL_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';

export const INITIAL_MEALS = [
  {
    id: 'meal-1',
    title: 'Morning Breakfast',
    time: '08:30 AM',
    calories: 620,
    protein: 42,
    carbs: 50,
    fat: 20,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnh4DqrxFwUMZsd71CGOL7JOozK_oaDbMcZgpyD6zLI_2U4EGZQDIlMtuZwGZYgrsaWXDSj8hC6-vD8JiGdiPpPo2oLCmNXPWtPLQNYMCcCQoXFs3QDFD9xVIg_gfT7zIOtmNbKaqbEBiP5DF4e9EK3u3kqbAQYNVNexcXMCI9o29bkhvJxyG8nKXyyoJldzUDrUFGGcWIhDrQyDrqNAcv-nFNwXJstzzSEGkuqVCdUrn7ZqaEOH1v'
  },
  {
    id: 'meal-2',
    title: 'Afternoon Lunch',
    time: '12:30 PM',
    calories: 850,
    protein: 65,
    carbs: 80,
    fat: 30,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMyjPpj_U5Xf8s6PeT7Qn750PgQTEvXvUBd4SF2aIOFTuYkRrOwo5tyABnzfGS_c9CjiQsiBjcQtvSBY7Tkc0Vsq_Cd9qv2ecBmPsxjFgL_tUzbNk2zlBQVtz5UOMpCw3oQGrp3bU8t6f-q8v5HFmXBb0Zp7mE-wMOB-b6ef6w81NbaqksdwyXlpdO6dEkLiemfuQrppNqph3CCoEx_S1D4PFPpkViwCWFhx8cNwoSY4hdcc3NyTei'
  },
  {
    id: 'meal-3',
    title: 'Night Dinner',
    time: '08:00 PM',
    calories: 980,
    protein: 58,
    carbs: 80,
    fat: 28,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARhKQxBGElXZhkjqNxXsbLzQmpXNHVdbfoUa50tL1eYuEv9WqiQl5TY3dPCmRaypwTNSYOdNAOaZWj7veitfk7jjSqWOooRmGjoDDM8buPVXvOoOUJglYggMZ_0YOAMmBBChBQhlP5P7QqeeNAK3IQxDQ2XqF-O_VRmAAkXyfogkkvn2pUzClizUld8AThJxoVCANkDj7oUsD3b4CF22Veg0Zdvu9xhOTq2V172gwfdUf-Hra4jWN8'
  }
];

export const DEFAULT_USER_PROFILE = {
  displayName: 'Rahul Sharma',
  username: '@rahul_fit',
  fitnessLevel: 'Intermediate',
  weight: 60,
  heightFt: 5,
  heightIn: 5,
  age: 24
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
