import type { PermissionMatrix } from '@/types/permission';

/**
 * Default permission matrix — this is what the assignment specifies.
 * 
 * This is loaded into the Zustand permissionStore on app start.
 * The Super Admin can edit it at runtime from the Permissions page.
 * 
 * Key design choice: permissions are DATA, not code.
 * We never write `if (role === 'admin')` — we always check this matrix.
 * This means the Super Admin can change any role's permissions without
 * touching code, and the change takes effect instantly.
 * 
 * Assignment defaults:
 * - Super Admin:  Full access + permission management + org management
 * - Auditor:      Read-only (view tickets + analytics only)
 * - Org Admin:    Manages tickets, staff, analytics within their org
 * - Team Lead:    Manages tickets + views analytics (no staff/org management)
 * - Agent:        Limited ticket actions (view + create + edit assigned tickets)
 */
export const defaultPermissions: PermissionMatrix = {
  super_admin: {
    view_tickets: true,
    create_tickets: true,
    edit_tickets: true,
    assign_tickets: true,
    delete_tickets: true,
    manage_staff: true,
    manage_organizations: true,
    view_analytics: true,
    manage_permissions: true,
  },
  auditor: {
    view_tickets: true,
    create_tickets: false,
    edit_tickets: false,
    assign_tickets: false,
    delete_tickets: false,
    manage_staff: false,
    manage_organizations: false,
    view_analytics: true,
    manage_permissions: false,
  },
  org_admin: {
    view_tickets: true,
    create_tickets: true,
    edit_tickets: true,
    assign_tickets: true,
    delete_tickets: true,
    manage_staff: true,
    manage_organizations: false, // can't manage OTHER orgs, only sees their own
    view_analytics: true,
    manage_permissions: false,
  },
  team_lead: {
    view_tickets: true,
    create_tickets: true,
    edit_tickets: true,
    assign_tickets: true,
    delete_tickets: false,        // can't delete — only org admin and above
    manage_staff: false,
    manage_organizations: false,
    view_analytics: true,
    manage_permissions: false,
  },
  agent: {
    view_tickets: true,           // can view (but only assigned tickets — enforced in service layer)
    create_tickets: true,
    edit_tickets: true,            // can edit their assigned tickets
    assign_tickets: false,
    delete_tickets: false,
    manage_staff: false,
    manage_organizations: false,
    view_analytics: false,
    manage_permissions: false,
  },
};
