import type { ReactNode } from 'react';
import { usePermission } from '../hooks/usePermission';
import type { PermissionAction } from '../types/permission';

/**
 * PermissionGuard — wraps content that requires a specific permission.
 * 
 * Used in two ways:
 * 
 * 1. AROUND ROUTES (in router.tsx):
 *    <PermissionGuard permission="view_analytics">
 *      <Analytics />
 *    </PermissionGuard>
 *    → If user doesn't have view_analytics, they see "Access Denied" instead.
 * 
 * 2. AROUND UI ELEMENTS (in components):
 *    <PermissionGuard permission="delete_tickets">
 *      <button>Delete Ticket</button>
 *    </PermissionGuard>
 *    → The delete button only renders if the user has permission.
 * 
 * WHY NOT JUST USE `can()` DIRECTLY?
 * You CAN use `can()` for simple cases: {can('delete') && <button>Delete</button>}
 * But PermissionGuard is better when:
 * - You want a fallback UI (like "Access Denied") instead of just hiding content
 * - You're wrapping entire pages/sections
 * - You want consistent access-denied handling across the app
 */
interface PermissionGuardProps {
  /** Which permission is required to see the children */
  permission: PermissionAction;

  /** Content to show if user HAS the permission */
  children: ReactNode;

  /** Optional: what to show if user DOESN'T have permission. Defaults to access denied message. */
  fallback?: ReactNode;
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { can } = usePermission();

  if (!can(permission)) {
    // If a custom fallback was provided, show it. Otherwise show default message.
    return fallback !== undefined ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to view this content.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
