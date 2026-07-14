/**
 * All possible roles in the system.
 * 
 * Two categories:
 * - Platform-level: super_admin, auditor → can see ALL organizations
 * - Org-level: org_admin, team_lead, agent → belong to ONE organization only
 */
export type Role = 'super_admin' | 'auditor' | 'org_admin' | 'team_lead' | 'agent';

/**
 * Roles that operate across all organizations.
 * These users have organizationId = null because they're not tied to one org.
 */
export type PlatformRole = Extract<Role, 'super_admin' | 'auditor'>;

/**
 * Roles that belong to exactly one organization.
 * These users MUST have an organizationId — they can never see other org's data.
 */
export type OrgRole = Extract<Role, 'org_admin' | 'team_lead' | 'agent'>;

/**
 * Represents a user in the system.
 * 
 * Key design decision: organizationId is null for platform users.
 * This makes it easy to check: if (user.organizationId) → org-scoped, else → platform-level.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  /**
   * null for platform-level users (super_admin, auditor).
   * For org-level users, this determines which org's data they can access.
   */
  organizationId: string | null;
  avatar?: string; // optional — we'll use initials as fallback
  createdAt: string;
}
