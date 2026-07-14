import { useQuery } from '@tanstack/react-query';
import { useCurrentOrganization } from '../../hooks/useCurrentOrganization';
import { analyticsService } from '../../services/analytics.service';
import { Loading } from '../../components/common/Loading';
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '../../data/defaults';

/**
 * Dashboard — landing page with ticket summary stats.
 * 
 * Shows total tickets, breakdown by status, and breakdown by priority.
 * All data is scoped to the current organization (or all orgs for platform users).
 * Uses React Query to fetch analytics with loading state.
 */
export function Dashboard() {
  const { orgId } = useCurrentOrganization();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', orgId],
    queryFn: () => analyticsService.getAnalytics(orgId ?? undefined),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Total Tickets Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-sm text-gray-500 uppercase tracking-wide">Total Tickets</p>
        <p className="text-4xl font-bold text-blue-600 mt-1">{analytics?.total ?? 0}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">By Status</h2>
          <div className="space-y-3">
            {analytics && Object.entries(analytics.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {TICKET_STATUS_LABELS[status as keyof typeof TICKET_STATUS_LABELS]}
                </span>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Priority */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">By Priority</h2>
          <div className="space-y-3">
            {analytics && Object.entries(analytics.byPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {TICKET_PRIORITY_LABELS[priority as keyof typeof TICKET_PRIORITY_LABELS]}
                </span>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
