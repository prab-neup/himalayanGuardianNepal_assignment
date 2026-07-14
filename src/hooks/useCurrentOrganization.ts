import { useSessionStore } from '../store/sessionStore';

/**
 * useCurrentOrganization — resolves which organization the user is currently viewing.
 * 
 * WHY THIS HOOK EXISTS:
 * Components need to know the current org to fetch the right data.
 * But the logic differs by user type:
 * - Platform users (super_admin, auditor): can switch between orgs via dropdown
 * - Org users (org_admin, team_lead, agent): always locked to their own org
 * 
 * This hook hides that complexity. Components just call:
 *   const { orgId } = useCurrentOrganization();
 *   ticketService.getAll(orgId);  // always gets the right org's data
 * 
 * They never need to think about "is this user platform or org level?"
 */
export function useCurrentOrganization() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const selectedOrgId = useSessionStore((state) => state.selectedOrgId);
  const setSelectedOrgId = useSessionStore((state) => state.setSelectedOrgId);

  /**
   * The resolved org ID:
   * - If user belongs to an org → always their org (can't change)
   * - If platform user → whatever they selected (or null for "all orgs")
   */
  const orgId = currentUser.organizationId ?? selectedOrgId;

  /**
   * Is this user a platform-level user who can view multiple orgs?
   * Used to show/hide the org selector dropdown.
   */
  const isPlatformUser = currentUser.organizationId === null;

  return {
    orgId,           // the current org being viewed (or null = all)
    isPlatformUser,  // can this user switch between orgs?
    setSelectedOrgId, // function to switch org (only works for platform users)
  };
}
