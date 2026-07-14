import { useSessionStore } from '../../store/sessionStore';
import { useUIStore } from '../../store/uiStore';
import { useCurrentOrganization } from '../../hooks/useCurrentOrganization';
import { organizations } from '../../data/organizations';
import { ROLE_LABELS } from '../../data/defaults';
import { SessionSwitcher } from './SessionSwitcher';

/**
 * Navbar — the top bar of the dashboard.
 * 
 * Contains:
 * - Hamburger menu button (toggles sidebar on mobile)
 * - SessionSwitcher (switch users + org selector)
 * - Current user info (name, role, current org name)
 */
export function Navbar() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { orgId } = useCurrentOrganization();

  // Resolve current org name for display
  const currentOrgName = orgId
    ? organizations.find((o) => o.id === orgId)?.name ?? 'Unknown'
    : 'All Organizations';

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger + Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
            aria-label="Toggle sidebar"
          >
            {/* Simple hamburger icon using text */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white font-semibold text-lg">FieldDesk</span>
        </div>

        {/* Center: Session Switcher */}
        <SessionSwitcher />

        {/* Right: Current user info */}
        <div className="text-right">
          <p className="text-sm text-white font-medium">{currentUser.name}</p>
          <p className="text-xs text-gray-400">
            {ROLE_LABELS[currentUser.role]} · {currentOrgName}
          </p>
        </div>
      </div>
    </nav>
  );
}
