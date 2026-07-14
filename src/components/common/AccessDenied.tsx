/**
 * AccessDenied — shown when a user tries to access content they don't have permission for.
 * Used by PermissionGuard as its default fallback.
 */
export function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Access Denied</h2>
        <p className="text-gray-500">You don't have permission to view this content.</p>
        <p className="text-sm text-gray-400 mt-2">
          Contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
