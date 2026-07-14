import type { Role } from './user';

/**
 * All possible permission actions in the system.
 * These match exactly what the assignment asks for.
 * 
 * Using a union type (not an enum) because:
 * - Unions are lighter — they disappear at runtime (no extra JS code)
 * - They work better with Record<> for building permission maps
 */
export type PermissionAction =
  | 'view_tickets'
  | 'create_tickets'
  | 'edit_tickets'
  | 'assign_tickets'
  | 'delete_tickets'
  | 'manage_staff'
  | 'manage_organizations'
  | 'view_analytics'
  | 'manage_permissions';

/**
 * For one role, which permissions are true/false.
 * 
 * Example for Auditor:
 * { view_tickets: true, create_tickets: false, edit_tickets: false, ... }
 * 
 * Record<PermissionAction, boolean> means:
 * - Every key MUST be one of the PermissionAction values
 * - Every value MUST be a boolean
 * - TypeScript will error if you miss a key
 */
export type RolePermissions = Record<PermissionAction, boolean>;

/**
 * The full permission matrix — maps every Role to its permissions.
 * 
 * This is THE single source of truth for access control.
 * It lives in the Zustand permissionStore as EDITABLE state.
 * When Super Admin toggles a checkbox, this map updates,
 * and every usePermission() hook re-evaluates instantly.
 * 
 * Shape:
 * {
 *   super_admin: { view_tickets: true, create_tickets: true, ... },
 *   auditor:     { view_tickets: true, create_tickets: false, ... },
 *   org_admin:   { ... },
 *   team_lead:   { ... },
 *   agent:       { ... },
 * }
 */
export type PermissionMatrix = Record<Role, RolePermissions>;
