import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '../features/01_auth/LandingPage';
import { LoginPage } from '../features/01_auth/LoginPage';
import { SignupPage } from '../features/01_auth/SignupPage';
import { OnboardingOverviewPage } from '../features/03_onboarding/OnboardingOverviewPage';
import { PersonalDetailsPage } from '../features/03_onboarding/PersonalDetailsPage';
import { ExperienceLevelPage } from '../features/03_onboarding/ExperienceLevelPage';
import { HomeDashboardPage } from '../features/09_analytics/HomeDashboardPage';
import { WorkoutSessionPage } from '../features/04_workout_plan/WorkoutSessionPage';
import { AiWorkoutCreatorPage } from '../features/07_ai_coach/AiWorkoutCreatorPage';
import { RecoveryAnalysisPage } from '../features/09_analytics/RecoveryAnalysisPage';
import { FitnessRecordsPage } from '../features/08_progress_tracking/FitnessRecordsPage';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/onboarding', element: <OnboardingOverviewPage /> },
  { path: '/onboarding/personal-details', element: <PersonalDetailsPage /> },
  { path: '/onboarding/experience-level', element: <ExperienceLevelPage /> },
  { path: '/dashboard', element: <HomeDashboardPage /> },
  { path: '/workout/session', element: <WorkoutSessionPage /> },
  { path: '/workout/ai-creator', element: <AiWorkoutCreatorPage /> },
  { path: '/recovery', element: <RecoveryAnalysisPage /> },
  { path: '/records', element: <FitnessRecordsPage /> },
  { path: '*', element: <HomeDashboardPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
