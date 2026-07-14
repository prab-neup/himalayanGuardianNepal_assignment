import { useSessionStore } from '../store/sessionStore';
import { usePermissionStore } from '../store/permissionStore';
import type { PermissionAction } from '../types/permission';

/**
 * usePermission — THE hook every component uses to check access.
 * 
 * HOW IT WORKS:
 * 1. Reads the current user's role from sessionStore
 * 2. Looks up that role's permissions from permissionStore
 * 3. Returns a `can()` function that checks one specific permission
 * 
 * WHY THIS HOOK IS SO IMPORTANT:
 * The assignment says "Access rules are not duplicated throughout the codebase."
 * Every permission check in the entire app goes through THIS hook.
 * We never write: if (user.role === 'admin') — that's duplicating logic.
 * We always write: if (can('delete_tickets')) — that reads from the store.
 * 
 * USAGE IN COMPONENTS:
 * ```tsx
 * const { can } = usePermission();
 * 
 * // Hide a button if user doesn't have permission
 * {can('delete_tickets') && <button>Delete</button>}
 * 
 * // Disable a field
 * <input disabled={!can('edit_tickets')} />
 * ```
 * 
 * REACTIVITY:
 * When the Super Admin toggles a permission in permissionStore,
 * every component calling usePermission() re-renders automatically
 * because it subscribes to the store. No reload needed.
 */
export function usePermission() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const hasPermission = usePermissionStore((state) => state.hasPermission);

  /**
   * Check if the current user can perform a specific action.
   * 
   * Example: can('delete_tickets') → true/false
   * 
   * It reads currentUser.role → looks up the permission matrix → returns boolean.
   */
  const can = (action: PermissionAction): boolean => {
    return hasPermission(currentUser.role, action);
  };

  return {
    can,
    currentUser,
    role: currentUser.role,
  };
}
