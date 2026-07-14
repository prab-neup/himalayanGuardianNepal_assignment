import { Outlet } from 'react-router-dom';

/**
 * DashboardLayout — the app shell that wraps every page.
 * 
 * Will contain: Sidebar (left) + Navbar (top) + main content area.
 * For now, just renders the child route via <Outlet />.
 * We'll build the full layout in Phase 8.
 */
export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar and Sidebar will be added in Phase 8 */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
