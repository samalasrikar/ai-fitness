import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Guard Placeholder
 * Authentication logic will be wired in Phase 2
 */
export function ProtectedRoute({ redirectTo = '/login' }) {
  // Placeholder condition: always allow in Phase 1 setup
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
