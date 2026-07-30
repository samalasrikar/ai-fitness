import { env } from '../config/env';
import { logger } from '../config/logger';
import { ApiError } from './ApiError';

export interface NutritionAIResponse {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
}

export interface WorkoutExerciseAI {
  name: string;
  sets: number;
  reps: string;
  rpe?: number;
  tag?: string;
  tagColor?: string;
  note?: string;
  extra?: string;
  imgAlt?: string;
  imgSrc?: string;
}

export interface WorkoutPlanAIResponse {
  title: string;
  duration: string;
  exercises: WorkoutExerciseAI[];
}

export interface ExerciseAnalysisAIResponse {
  exerciseName: string;
  mechanicalTensionRating: number;
  fatigueImpact: string;
  biomechanicalRiskScore: string;
  targetMuscles: Array<{ name: string; activation: string }>;
  aiTips: string[];
}

export interface NutritionRecommendationsAIResponse {
  recommendedCalories: number;
  recommendedProtein: number;
  recommendedCarbs: number;
  recommendedFat: number;
  hydrationLiters: number;
  recommendations: string[];
  sampleMealPlan: Array<{ meal: string; suggestion: string }>;
}

export interface GoalDriftAIResponse {
  goalName: string;
  targetDate: string;
  progressPercentage: number;
  projectedCompletionDate: string;
  driftDays: number;
  recommendation: string;
  actionSteps?: string[];
}

export interface ProgressInsightsAIResponse {
  aiInsights: string[];
}

export class AIService {
  private static apiKey = env.OPENROUTER_API_KEY;
  private static baseUrl = env.OPENROUTER_BASE_URL;
  private static model = env.OPENROUTER_MODEL;

  /**
   * Internal Core OpenRouter Chat Completions Call
   */
  private static async callOpenRouter(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    temperature: number = 0.3,
    targetModel: string = this.model
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const payload = {
      model: targetModel,
      messages,
      temperature,
    };

    logger.debug('[AIService] Sending request to OpenRouter', {
      model: targetModel,
      messageCount: messages.length,
    });

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://fitaix.com',
          'X-Title': 'FitAI X',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('[AIService] OpenRouter API HTTP Error', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });

        if (response.status === 401 || response.status === 403) {
          throw ApiError.unauthorized('Invalid or unauthorized OpenRouter API Key.');
        }
        if (response.status === 429) {
          throw ApiError.internal('OpenRouter rate limit exceeded. Please try again shortly.');
        }

        if (targetModel !== 'openrouter/auto') {
          logger.warn('[AIService] Retrying request with openrouter/auto model fallback');
          return this.callOpenRouter(messages, temperature, 'openrouter/auto');
        }

        throw ApiError.internal(`OpenRouter provider error: ${response.statusText} (${response.status})`);
      }

      const data: any = await response.json();
      logger.debug('[AIService] OpenRouter API Response received', {
        status: response.status,
        model: data?.model,
      });

      const content = data?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string') {
        throw ApiError.internal('OpenRouter returned an empty or invalid response.');
      }

      if (content.includes('User Safety:') && targetModel !== 'google/gemini-2.5-flash-lite') {
        logger.warn('[AIService] OpenRouter routed to safety classifier, retrying with google/gemini-2.5-flash-lite');
        return this.callOpenRouter(messages, temperature, 'google/gemini-2.5-flash-lite');
      }

      return content;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err.name === 'AbortError') {
        throw ApiError.internal('OpenRouter API request timed out (25s exceeded).');
      }
      logger.error('[AIService] Request failed', { error: err.message });
      throw ApiError.internal(`AI Engine Communication Error: ${err.message}`);
    }
  }

  /**
   * Helper to parse JSON output cleanly from LLM response
   */
  private static parseJsonFromLLM<T>(content: string): T {
    try {
      let cleaned = content.replace(/```json/gi, '').replace(/```/g, '').trim();

      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }

      return JSON.parse(cleaned) as T;
    } catch (err: any) {
      logger.error('[AIService] Failed to parse LLM JSON response', { content, error: err.message });
      throw ApiError.internal('AI provider returned response that could not be parsed as valid JSON.');
    }
  }

  /**
   * Meal Analysis AI
   */
  public static async analyzeMealWithAI(mealDescription: string): Promise<NutritionAIResponse> {
    if (!mealDescription || mealDescription.trim() === '') {
      throw ApiError.badRequest('Meal description is required.');
    }

    const systemPrompt = `You are a precision sports nutritionist AI. Analyze the meal description and compute calories and macronutrients in grams.
Respond ONLY with a JSON object without markdown fences, explanations, or backticks. Format:
{
  "mealName": "Name of meal",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "description": "Short summary of meal"
}`;

    const userPrompt = `Analyze meal: "${mealDescription}"`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      0.1
    );

    const parsed = this.parseJsonFromLLM<NutritionAIResponse>(content);
    if (parsed.calories === undefined || parsed.protein === undefined) {
      throw ApiError.internal('AI provider returned incomplete nutrition analysis.');
    }

    return {
      mealName: parsed.mealName ? parsed.mealName : mealDescription.slice(0, 30),
      calories: Math.round(parsed.calories),
      protein: Math.round(parsed.protein),
      carbs: Math.round(parsed.carbs),
      fat: Math.round(parsed.fat),
      fiber: parsed.fiber ? Math.round(parsed.fiber) : 0,
      description: parsed.description ? parsed.description : mealDescription,
    };
  }

  /**
   * AI Coach Chat Response
   */
  public static async generateCoachReply(userText: string, chatHistory: any[] = []): Promise<string> {
    if (!userText || userText.trim() === '') {
      throw ApiError.badRequest('Message is required.');
    }

    const systemMessage = {
      role: 'system' as const,
      content: `You are FitAI X, an elite AI strength, hypertrophy, and biomechanics coach.
Provide concise (2-3 sentences max), actionable, scientific, and highly motivating coaching advice.
Never include raw markdown formatting like headers or giant text blocks. Keep responses crisp and direct.`,
    };

    const messages = [
      systemMessage,
      ...chatHistory.slice(-4).map((msg: any) => ({
        role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: String(msg.text ? msg.text : msg.content ? msg.content : ''),
      })),
      { role: 'user' as const, content: userText },
    ];

    return this.callOpenRouter(messages, 0.7);
  }

  /**
   * AI Workout Plan Generation
   */
  public static async generateWorkoutPlanWithAI(input: {
    focusArea?: string;
    targetDuration?: number;
    equipment?: string[];
    energyLevel?: number;
  }): Promise<WorkoutPlanAIResponse> {
    const focus = input.focusArea ? input.focusArea : 'Full Body Hypertrophy';
    const duration = input.targetDuration ? input.targetDuration : 45;
    const equip = input.equipment && input.equipment.length > 0 ? input.equipment.join(', ') : 'Full Gym';

    const systemPrompt = `You are a high-performance strength & hypertrophy head coach.
Generate a structured workout plan formatted strictly as raw JSON (no markdown, no backticks).
Structure required:
{
  "title": "${focus} Protocol",
  "duration": "${duration} mins",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 4,
      "reps": "8-10",
      "rpe": 8.5,
      "tag": "AI OPTIMIZED",
      "tagColor": "bg-[#f5c400] text-black",
      "note": "Target mechanical tension",
      "extra": "REST: 90s",
      "imgAlt": "Exercise Name",
      "imgSrc": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400"
    }
  ]
}
Return between 3 and 5 exercises customized to focus area, equipment, and duration.`;

    const userPrompt = `Create workout for focus area: ${focus}, duration: ${duration} minutes, equipment: ${equip}.`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      0.4
    );

    return this.parseJsonFromLLM<WorkoutPlanAIResponse>(content);
  }

  /**
   * AI Exercise Biomechanics Analysis
   */
  public static async generateExerciseAnalysisWithAI(exerciseName: string): Promise<ExerciseAnalysisAIResponse> {
    if (!exerciseName || exerciseName.trim() === '') {
      throw ApiError.badRequest('Exercise name is required.');
    }

    const systemPrompt = `You are a biomechanics and exercise science AI specialist.
Analyze the requested exercise and return raw JSON strictly matching:
{
  "exerciseName": "${exerciseName}",
  "mechanicalTensionRating": 9.2,
  "fatigueImpact": "High CNS / Moderate Spinal Load",
  "biomechanicalRiskScore": "Low (With Strict Form)",
  "targetMuscles": [
    { "name": "Primary Muscle", "activation": "92%" },
    { "name": "Secondary Muscle", "activation": "84%" }
  ],
  "aiTips": [
    "Tip 1 for execution",
    "Tip 2 for hypertrophy alignment"
  ]
}`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze exercise biomechanics for: ${exerciseName}` },
      ],
      0.3
    );

    return this.parseJsonFromLLM<ExerciseAnalysisAIResponse>(content);
  }

  /**
   * AI Nutrition Recommendations
   */
  public static async generateNutritionRecommendationsWithAI(userContext: any = {}): Promise<NutritionRecommendationsAIResponse> {
    const systemPrompt = `You are an elite sports dietitian AI.
Return raw JSON strictly formatted as:
{
  "recommendedCalories": 2450,
  "recommendedProtein": 185,
  "recommendedCarbs": 260,
  "recommendedFat": 70,
  "hydrationLiters": 3.5,
  "recommendations": [
    "Prioritize protein within 45 mins post workout",
    "Increase sodium intake on heavy leg training days"
  ],
  "sampleMealPlan": [
    { "meal": "Breakfast", "suggestion": "Oatmeal with whey protein and berries" },
    { "meal": "Lunch", "suggestion": "Grilled chicken breast with quinoa and avocado" }
  ]
}`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate sports nutrition recommendations for: ${JSON.stringify(userContext)}` },
      ],
      0.3
    );

    return this.parseJsonFromLLM<NutritionRecommendationsAIResponse>(content);
  }

  /**
   * AI Goal Drift & Progress Recommendations
   */
  public static async generateGoalDriftRecommendationsWithAI(goalContext: any = {}): Promise<GoalDriftAIResponse> {
    const systemPrompt = `You are an AI fitness analytics strategy engine.
Return raw JSON strictly formatted as:
{
  "goalName": "Hypertrophy & Physique Target",
  "targetDate": "2026-10-31",
  "progressPercentage": 72,
  "projectedCompletionDate": "2026-11-05",
  "driftDays": 5,
  "recommendation": "Adjust daily caloric target by +150 kcal and add 1 work set on progressive overload days.",
  "actionSteps": [
    "Increase weekly compound volume by 5%",
    "Ensure 8 hours of sleep for recovery"
  ]
}`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze goal drift for context: ${JSON.stringify(goalContext)}` },
      ],
      0.3
    );

    return this.parseJsonFromLLM<GoalDriftAIResponse>(content);
  }

  /**
   * AI Progress Insights
   */
  public static async generateProgressInsightsWithAI(metricsContext: any = {}): Promise<ProgressInsightsAIResponse> {
    const systemPrompt = `You are an AI athletic progress analyst.
Analyze progress metrics and return raw JSON strictly formatted as:
{
  "aiInsights": [
    "Insight statement 1 based on progressive overload",
    "Insight statement 2 based on workout streak",
    "Insight statement 3 based on strength volume"
  ]
}`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate 3 performance insights for: ${JSON.stringify(metricsContext)}` },
      ],
      0.3
    );

    return this.parseJsonFromLLM<ProgressInsightsAIResponse>(content);
  }

  /**
   * AI Structured Meal Plan Generation
   */
  public static async generateMealPlanFromCriteria(input: {
    goal: string;
    targetCalories: number;
    dietPreference?: string;
    allergies?: string[];
    budget?: string;
    cuisine?: string;
  }) {
    if (!input.goal || input.goal.trim() === '') {
      throw ApiError.badRequest('Goal is required.');
    }
    if (!input.targetCalories || isNaN(Number(input.targetCalories))) {
      throw ApiError.badRequest('Target calories are required.');
    }

    const diet = input.dietPreference ? input.dietPreference : 'Balanced';
    const allergiesStr = input.allergies && input.allergies.length > 0 ? input.allergies.join(', ') : 'None';
    const budgetStr = input.budget ? input.budget : 'Standard';
    const cuisineStr = input.cuisine ? input.cuisine : 'International';

    const systemPrompt = `You are a precision sports nutrition AI.
Generate a daily structured meal plan formatted strictly as raw JSON (no markdown, no backticks):
{
  "title": "${input.goal} Meal Plan",
  "targetCalories": ${input.targetCalories},
  "dietType": "${diet}",
  "meals": [
    {
      "mealType": "Breakfast",
      "name": "Oatmeal & Whey Protein",
      "items": ["Rolled Oats", "Whey Protein", "Berries"],
      "calories": 550,
      "protein": 40,
      "carbs": 65,
      "fat": 12
    },
    {
      "mealType": "Lunch",
      "name": "Grilled Chicken & Quinoa Bowl",
      "items": ["Chicken Breast", "Quinoa", "Avocado", "Steamed Broccoli"],
      "calories": 700,
      "protein": 52,
      "carbs": 70,
      "fat": 18
    },
    {
      "mealType": "Dinner",
      "name": "Salmon & Sweet Potato",
      "items": ["Wild Salmon", "Baked Sweet Potato", "Asparagus"],
      "calories": 650,
      "protein": 45,
      "carbs": 55,
      "fat": 20
    },
    {
      "mealType": "Snacks",
      "name": "Greek Yogurt & Almonds",
      "items": ["Greek Yogurt", "Raw Almonds"],
      "calories": 300,
      "protein": 22,
      "carbs": 20,
      "fat": 12
    }
  ]
}`;

    const userPrompt = `Create daily meal plan for goal: ${input.goal}, calories: ${input.targetCalories}, diet: ${diet}, allergies: ${allergiesStr}, budget: ${budgetStr}, cuisine: ${cuisineStr}.`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      0.4
    );

    return this.parseJsonFromLLM<any>(content);
  }

  /**
   * AI History-Derived Workout Recommendations (Module 4)
   */
  public static async generateHistoryBasedWorkoutRecommendations(history: any[] = [], volumeData: any = {}): Promise<string[]> {
    const systemPrompt = `You are an AI head strength coach.
Analyze the user's actual recent workout history and return raw JSON strictly formatted as:
{
  "recommendations": [
    "Specific actionable recommendation 1 based on muscle balance",
    "Specific actionable recommendation 2 based on frequency and volume",
    "Specific actionable recommendation 3 based on recovery time"
  ]
}`;

    const userPrompt = `Analyze workout history: ${JSON.stringify({ history: history.slice(0, 10), volumeData })}`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      0.3
    );

    const parsed = this.parseJsonFromLLM<{ recommendations: string[] }>(content);
    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      throw ApiError.internal('AI provider returned invalid recommendation structure.');
    }
    return parsed.recommendations;
  }

  /**
   * AI History-Derived Nutrition Recommendations (Module 8)
   */
  public static async generateHistoryBasedNutritionRecommendations(mealHistory: any[] = [], totals: any = {}): Promise<string[]> {
    const systemPrompt = `You are an AI sports nutrition specialist.
Analyze the user's actual logged meals and macro totals, and return raw JSON strictly formatted as:
{
  "recommendations": [
    "Actionable nutrition advice 1 based on macro balance",
    "Actionable nutrition advice 2 based on calorie target gap",
    "Actionable nutrition advice 3 based on hydration and nutrient density"
  ]
}`;

    const userPrompt = `Analyze meal history: ${JSON.stringify({ meals: mealHistory.slice(0, 10), totals })}`;

    const content = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      0.3
    );

    const parsed = this.parseJsonFromLLM<{ recommendations: string[] }>(content);
    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      throw ApiError.internal('AI provider returned invalid nutrition recommendation structure.');
    }
    return parsed.recommendations;
  }
}
