import { useSessionStore } from '../../store/sessionStore';
import { useCurrentOrganization } from '../../hooks/useCurrentOrganization';
import { users } from '../../data/users';
import { organizations } from '../../data/organizations';
import { ROLE_LABELS } from '../../data/defaults';

/**
 * SessionSwitcher — lets the evaluator switch between seeded users.
 * 
 * The assignment says: "Provide a way to switch between seeded users
 * so each role can be tested."
 * 
 * This component has two dropdowns:
 * 1. User Selector — switch "login" to any seeded user
 * 2. Organization Selector — (only for platform users) pick which org to view
 * 
 * When you switch user:
 * - sessionStore updates → usePermission() re-evaluates everywhere
 * - Sidebar links change, route access changes, buttons show/hide
 * - If the new user is org-level, they're auto-locked to their org
 */
export function SessionSwitcher() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const setCurrentUser = useSessionStore((state) => state.setCurrentUser);
  const { orgId, isPlatformUser, setSelectedOrgId } = useCurrentOrganization();

  return (
    <div className="flex items-center gap-3">
      {/* User Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="user-select" className="text-sm text-gray-400">
          User:
        </label>
        <select
          id="user-select"
          value={currentUser.id}
          onChange={(e) => {
            const user = users.find((u) => u.id === e.target.value);
            if (user) setCurrentUser(user);
          }}
          className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({ROLE_LABELS[user.role]})
            </option>
          ))}
        </select>
      </div>

      {/* Organization Selector — only for platform users */}
      {isPlatformUser && (
        <div className="flex items-center gap-2">
          <label htmlFor="org-select" className="text-sm text-gray-400">
            Org:
          </label>
          <select
            id="org-select"
            value={orgId ?? 'all'}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedOrgId(value === 'all' ? null : value);
            }}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Organizations</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
