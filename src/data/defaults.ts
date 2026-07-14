import type { TicketStatus, TicketPriority } from '../types/ticket';
import type { Role } from '../types/user';
import type { PermissionAction } from '../types/permission';

/**
 * Human-readable labels for ticket statuses.
 * Used in dropdowns, badges, and table columns.
 * Record<TicketStatus, string> ensures we have a label for EVERY status.
 */
export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

/**
 * Human-readable labels for ticket priorities.
 */
export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

/**
 * Human-readable labels for roles.
 * Used in the session switcher dropdown and staff table.
 */
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  auditor: 'Auditor',
  org_admin: 'Organization Admin',
  team_lead: 'Team Lead',
  agent: 'Agent',
};

/**
 * Human-readable labels for permission actions.
 * Used in the PermissionTable (the matrix grid).
 */
export const PERMISSION_LABELS: Record<PermissionAction, string> = {
  view_tickets: 'View Tickets',
  create_tickets: 'Create Tickets',
  edit_tickets: 'Edit Tickets',
  assign_tickets: 'Assign Tickets',
  delete_tickets: 'Delete Tickets',
  manage_staff: 'Manage Staff',
  manage_organizations: 'Manage Organizations',
  view_analytics: 'View Analytics',
  manage_permissions: 'Manage Permissions',
};

/**
 * All roles in display order.
 * Used to iterate over roles in the permission table and dropdowns.
 */
export const ALL_ROLES: Role[] = [
  'super_admin',
  'auditor',
  'org_admin',
  'team_lead',
  'agent',
];

/**
 * All permission actions in display order.
 */
export const ALL_PERMISSIONS: PermissionAction[] = [
  'view_tickets',
  'create_tickets',
  'edit_tickets',
  'assign_tickets',
  'delete_tickets',
  'manage_staff',
  'manage_organizations',
  'view_analytics',
  'manage_permissions',
];
