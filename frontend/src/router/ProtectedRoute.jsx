import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../providers/AuthContext';

/**
 * ProtectedRoute Guard
 * Verifies in-memory authentication state and shows loader during initial session restore
 */
export function ProtectedRoute({ redirectTo = '/login' }) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#f5c400]/30 border-t-[#f5c400] rounded-full animate-spin" />
          <span className="text-xs text-[#d1c5ab]/60 font-semibold tracking-wider uppercase">Restoring Session…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
