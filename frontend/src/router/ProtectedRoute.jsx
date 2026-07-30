import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Guard Placeholder
 * Authentication logic will be wired in Phase 2
 */
export function ProtectedRoute({ redirectTo = '/login' }) {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
