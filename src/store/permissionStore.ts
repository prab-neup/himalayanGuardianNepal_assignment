import { create } from 'zustand';
import type { Role } from '../types/user';
import type { PermissionAction, PermissionMatrix } from '../types/permission';
import { defaultPermissions } from '../data/permissions';

/**
 * Permission Store — THE single source of truth for access control.
 * 
 * WHY THIS IS THE MOST IMPORTANT STORE:
 * The assignment says:
 * - "Permission rules come from one shared source of truth"
 * - "Updating a permission immediately affects routes, navigation, controls, fields, and actions"
 * - "Permissions should be stored as editable application data"
 * 
 * This store holds the entire role→permission matrix as MUTABLE state.
 * When the Super Admin toggles a permission checkbox:
 * 1. togglePermission() updates the matrix here
 * 2. Every component using usePermission() hook re-renders
 * 3. Buttons hide/show, routes block/allow, sidebar links appear/disappear
 * 4. NO page reload needed — Zustand reactivity handles it
 * 
 * WHY NOT HARDCODED IF-ELSE?
 * Bad:  if (role === 'admin') { showButton(); }
 * Good: if (can('delete_tickets')) { showButton(); }
 * 
 * The "bad" way means changing permissions requires changing code.
 * The "good" way reads from this store — the Super Admin changes it at runtime.
 */

interface PermissionState {
  /** The full matrix: which role has which permissions */
  permissions: PermissionMatrix;

  /** Check if a role has a specific permission */
  hasPermission: (role: Role, action: PermissionAction) => boolean;

  /** Toggle a single permission for a role (Super Admin uses this) */
  togglePermission: (role: Role, action: PermissionAction) => void;

  /** Reset all permissions back to defaults */
  resetPermissions: () => void;
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: { ...defaultPermissions },

  /**
   * Check if a role has a specific permission.
   * get() reads the CURRENT state (not stale closure values).
   * This is why we use get() instead of accessing permissions directly.
   */
  hasPermission: (role: Role, action: PermissionAction): boolean => {
    return get().permissions[role][action];
  },

  /**
   * Toggle one cell in the permission matrix.
   * Example: togglePermission('agent', 'delete_tickets')
   * → flips agent's delete_tickets from false to true (or vice versa)
   * 
   * We spread at every level to create new objects,
   * because Zustand (like React) uses reference equality to detect changes.
   * If we mutated the existing object, React wouldn't know to re-render.
   */
  togglePermission: (role: Role, action: PermissionAction) =>
    set((state) => ({
      permissions: {
        ...state.permissions, // spread all roles
        [role]: {
          ...state.permissions[role], // spread all permissions for this role
          [action]: !state.permissions[role][action], // flip the boolean
        },
      },
    })),

  /** Reset to the defaults from data/permissions.ts */
  resetPermissions: () =>
    set({ permissions: { ...defaultPermissions } }),
}));
