import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

/**
 * DashboardLayout — the main app shell.
 * 
 * Structure:
 * ┌──────────────────────────────────────┐
 * │              Navbar                  │
 * ├──────────┬───────────────────────────┤
 * │          │                           │
 * │ Sidebar  │     Page Content          │
 * │          │     (<Outlet />)          │
 * │          │                           │
 * └──────────┴───────────────────────────┘
 * 
 * <Outlet /> is React Router's way of rendering child routes.
 * Whatever page matches the current URL gets rendered here.
 */
export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar — full width */}
      <Navbar />

      {/* Body — sidebar + content side by side */}
      <div className="flex">
        {/* Left sidebar — navigation */}
        <Sidebar />

        {/* Main content area — renders the matched page */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
