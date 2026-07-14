import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

/**
 * QueryClient — the React Query "brain".
 * 
 * It manages all query caching, refetching, and invalidation.
 * We create it ONCE here and provide it to the entire app.
 * 
 * defaults:
 * - staleTime: 5 minutes → data is considered "fresh" for 5 min (no refetch)
 * - retry: 1 → retry failed requests once before showing error
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Providers — wraps the entire app with all necessary context providers.
 * 
 * Currently only React Query, but this is the place to add more:
 * - Theme provider
 * - Toast/notification provider
 * - Any other context providers
 * 
 * Note: Zustand stores don't need providers — that's one of Zustand's advantages.
 * You just import and use them directly. No <StoreProvider> wrapper needed.
 */
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
