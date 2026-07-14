import { create } from 'zustand';

/**
 * UI Store — controls visual state that doesn't belong to any feature.
 * 
 * Things like:
 * - Is the sidebar collapsed? (for responsive layout)
 * - Which modal is currently open?
 * 
 * WHY A SEPARATE STORE?
 * UI state is completely independent from business data (tickets, users).
 * Mixing them in one store would cause unnecessary re-renders.
 * Example: opening the sidebar shouldn't re-fetch tickets.
 */

interface UIState {
  /** Whether the sidebar is collapsed (for mobile/small screens) */
  sidebarOpen: boolean;

  /** Toggle sidebar open/closed */
  toggleSidebar: () => void;

  /** Explicitly set sidebar state */
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open: boolean) =>
    set({ sidebarOpen: open }),
}));
