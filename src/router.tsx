import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './guards/ProtectedRoute';

/**
 * Router — defines all routes in the application.
 * 
 * STRUCTURE:
 * All routes sit under ProtectedRoute, which checks for a logged-in user.
 * Inside that, a DashboardLayout wraps every page with Sidebar + Navbar.
 * 
 * Permission checks happen at the PAGE level using PermissionGuard
 * inside each page component — not here in the router.
 * 
 * WHY NOT PUT PERMISSION GUARDS HERE?
 * We could, but it makes the router messy and harder to read.
 * Instead, each page component wraps itself with <PermissionGuard>
 * if it needs a specific permission. This keeps the router clean
 * and the permission logic close to the page that uses it.
 * 
 * NOTE: We lazy-load nothing for now (it's a small app).
 * In a large app, you'd use React.lazy() + Suspense for code splitting.
 */

// Page imports — we'll fill these in Phase 9
// For now, we create simple placeholder components so the router works
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Tickets } from './pages/Tickets/Tickets';
import { CreateTicket } from './pages/Tickets/CreateTicket';
import { EditTicket } from './pages/Tickets/EditTicket';
import { TicketDetail } from './pages/Tickets/TicketDetail';
import { Organizations } from './pages/Organizations/Organizations';
import { Staff } from './pages/Staff/Staff';
import { Analytics } from './pages/Analytics/Analytics';
import { Permissions } from './pages/Permissions/Permissions';
import { NotFound } from './pages/NotFound';
import { DashboardLayout } from './components/layout/DashboardLayout';

export const router = createBrowserRouter([
  {
    // All routes require a user (ProtectedRoute)
    element: <ProtectedRoute />,
    children: [
      {
        // DashboardLayout wraps every page with Sidebar + Navbar
        element: <DashboardLayout />,
        children: [
          // Redirect root to dashboard
          { index: true, element: <Navigate to="/dashboard" replace /> },

          // Main pages
          { path: 'dashboard', element: <Dashboard /> },

          // Ticket routes
          { path: 'tickets', element: <Tickets /> },
          { path: 'tickets/new', element: <CreateTicket /> },
          { path: 'tickets/:id', element: <TicketDetail /> },
          { path: 'tickets/:id/edit', element: <EditTicket /> },

          // Organization & Staff
          { path: 'organizations', element: <Organizations /> },
          { path: 'staff', element: <Staff /> },

          // Analytics & Permissions
          { path: 'analytics', element: <Analytics /> },
          { path: 'permissions', element: <Permissions /> },

          // 404 catch-all
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]);
