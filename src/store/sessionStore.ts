import { create } from 'zustand';
import type { User } from '../types/user';
import { users } from '../data/users';

/**
 * Session Store — tracks the currently "logged in" user and selected organization.
 * 
 * WHY ZUSTAND?
 * - React Context re-renders EVERY component under the Provider when state changes
 * - Zustand only re-renders components that subscribe to the specific slice that changed
 * - For session/permissions that affect every page, this is much more performant
 * 
 * HOW SESSION SIMULATION WORKS:
 * The assignment says "Provide a way to switch between seeded users."
 * We don't have real auth — instead we have a dropdown (SessionSwitcher)
 * that calls setCurrentUser() to "log in" as any seeded user.
 * 
 * ORGANIZATION SELECTION:
 * - Platform users (super_admin, auditor): can pick which org to view via setSelectedOrgId()
 * - Org users (org_admin, team_lead, agent): selectedOrgId is auto-set to their own org
 *   and they can't change it — they're locked to their org.
 */

interface SessionState {
  /** The currently active user. Defaults to Super Admin so the app starts usable. */
  currentUser: User;

  /**
   * Which organization the user is currently viewing.
   * - For org-level users: always their own organizationId (can't change)
   * - For platform users: whichever org they selected from the dropdown
   * - null means "all orgs" (only platform users can see this)
   */
  selectedOrgId: string | null;

  /** Switch to a different user (the session switcher dropdown calls this) */
  setCurrentUser: (user: User) => void;

  /** Switch which organization to view (only for platform users) */
  setSelectedOrgId: (orgId: string | null) => void;
}

/**
 * create() makes a Zustand store.
 * The (set) function is how you update state — it merges the new values in.
 * 
 * We default to the first user (Super Admin) so the app starts with full access.
 * When switching to an org-level user, we auto-set selectedOrgId to their org.
 */
export const useSessionStore = create<SessionState>((set) => ({
  currentUser: users[0], // Super Admin — full access on first load

  selectedOrgId: null, // null = viewing all orgs (platform user default)

  setCurrentUser: (user: User) =>
    set({
      currentUser: user,
      /**
       * Key logic: when switching users, auto-set the org scope.
       * If the new user belongs to an org → lock them to that org.
       * If they're platform-level (orgId is null) → show all orgs (null).
       */
      selectedOrgId: user.organizationId ?? null,
    }),

  setSelectedOrgId: (orgId: string | null) =>
    set({ selectedOrgId: orgId }),
}));
