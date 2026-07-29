import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LandingOrDashboard from '../components/LandingOrDashboard';
import FitXAIDashboard from '../components/FitXAIDashboard';
import OnboardingWizard from '../components/OnboardingWizard';
import Login from '../components/Login';
import Signup from '../components/Signup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingOrDashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <FitXAIDashboard />,
      },
      {
        path: '/setup',
        element: <OnboardingWizard />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
