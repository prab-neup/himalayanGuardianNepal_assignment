import { apiClient } from '../api/client';
import type { TicketStatus, TicketPriority } from '../types/ticket';

/**
 * Shape of the analytics response from the API.
 * We define it here (not in types/) because it's API-specific —
 * it's the shape the backend returns, not a domain entity.
 */
export interface AnalyticsData {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
}

/**
 * Analytics service — fetches computed ticket analytics.
 * 
 * The mock backend computes these counts from the ticket array.
 * In a real app, the backend might use database aggregation queries
 * for performance (COUNT, GROUP BY).
 */
export const analyticsService = {
  /**
   * Fetch analytics data, optionally scoped to an organization.
   * If no orgId, returns analytics across ALL tickets.
   */
  getAnalytics: async (orgId?: string): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>('/analytics', {
      params: orgId ? { orgId } : {},
    });
    return response.data;
  },
};
