import { NavLink } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';
import { useUIStore } from '../../store/uiStore';
import type { PermissionAction } from '../../types/permission';

/**
 * Sidebar navigation item type.
 * Each item can optionally require a permission — if the user
 * doesn't have that permission, the link is hidden entirely.
 */
interface NavItem {
  label: string;
  path: string;
  /** If set, this link only shows when user has this permission */
  permission?: PermissionAction;
}

/**
 * All navigation items.
 * 
 * Notice: Dashboard has no permission requirement — everyone can see it.
 * Other items are gated by permissions. If the Super Admin removes
 * 'view_analytics' from a role, the Analytics link disappears from
 * that role's sidebar INSTANTLY (no reload).
 */
const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Tickets', path: '/tickets', permission: 'view_tickets' },
  { label: 'Organizations', path: '/organizations', permission: 'manage_organizations' },
  { label: 'Staff', path: '/staff', permission: 'manage_staff' },
  { label: 'Analytics', path: '/analytics', permission: 'view_analytics' },
  { label: 'Permissions', path: '/permissions', permission: 'manage_permissions' },
];

/**
 * Sidebar — left navigation panel.
 * 
 * KEY BEHAVIOR: Links show/hide based on the permission matrix.
 * The navItems array defines which permission each link needs.
 * We filter using can() from usePermission — the same hook
 * every other component uses. Single source of truth.
 * 
 * Uses NavLink (not Link) because NavLink gives us `isActive`
 * which lets us highlight the current page.
 */
export function Sidebar() {
  const { can } = usePermission();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  // Filter nav items based on current user's permissions
  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true; // no permission needed → always show
    return can(item.permission);       // check the permission matrix
  });

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="p-4">
        <nav className="space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
