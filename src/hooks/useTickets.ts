import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticket.service';
import { useCurrentOrganization } from './useCurrentOrganization';
import type { CreateTicketDTO, UpdateTicketDTO } from '../types/ticket';

/**
 * useTickets — React Query hook for all ticket operations.
 * 
 * WHY REACT QUERY?
 * Without it, you'd need to manually manage:
 * - loading state (useState for isLoading)
 * - error state (try/catch + useState)
 * - caching (avoid re-fetching the same data)
 * - refetching after mutations (create/update/delete)
 * 
 * React Query handles ALL of this automatically:
 * - useQuery() → fetches data, gives you { data, isLoading, error }
 * - useMutation() → handles create/update/delete with onSuccess callbacks
 * - queryClient.invalidateQueries() → refetches the list after any mutation
 * 
 * QUERY KEYS:
 * ['tickets', orgId] — React Query caches by key.
 * If orgId changes (user switches org), it refetches automatically.
 * If orgId is the same, it returns cached data instantly.
 */

/** Hook for fetching the ticket list */
export function useTickets() {
  const { orgId } = useCurrentOrganization();

  return useQuery({
    /**
     * Query key: ['tickets', orgId]
     * React Query uses this to cache and invalidate.
     * Different orgId = different cache = automatic refetch.
     */
    queryKey: ['tickets', orgId],

    /**
     * Query function: calls our service layer.
     * orgId can be null (platform user viewing all orgs) or a string.
     * We pass undefined if null — the service handles both cases.
     */
    queryFn: () => ticketService.getAll(orgId ?? undefined),
  });
}

/** Hook for fetching a single ticket */
export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketService.getById(id),
    enabled: !!id, // don't fetch if id is empty
  });
}

/** Hook for creating a ticket */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketDTO) => ticketService.create(data),

    /**
     * After creating a ticket, invalidate the tickets list cache.
     * This tells React Query: "the list is stale, refetch it."
     * The UI automatically shows the new ticket without manual state management.
     */
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

/** Hook for updating a ticket */
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketDTO }) =>
      ticketService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

/** Hook for deleting a ticket */
export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
