import { Navigate, Outlet } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';

/**
 * ProtectedRoute — wraps routes that require a "logged in" user.
 * 
 * In a real app with authentication, this would check for a valid JWT token.
 * In our assignment, since we always have a seeded user selected,
 * this mostly acts as a structural guard and a place to wrap the layout.
 * 
 * <Outlet /> renders whatever child route matched.
 * Think of it like {children} but for React Router.
 * 
 * If somehow no user is set, we redirect to root (shouldn't happen with our defaults).
 */
export function ProtectedRoute() {
  const currentUser = useSessionStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Render the matched child route
  return <Outlet />;
}
