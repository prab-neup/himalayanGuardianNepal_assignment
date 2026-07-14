import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { analyticsService } from '../../services/analytics.service';
import { useCurrentOrganization } from '../../hooks/useCurrentOrganization';
import { usePermission } from '../../hooks/usePermission';
import { PermissionGuard } from '../../guards/PermissionGuard';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '../../data/defaults';

/**
 * Colors for charts.
 */
const STATUS_COLORS = {
  open: '#EAB308', // yellow-500
  in_progress: '#3B82F6', // blue-500
  resolved: '#22C55E', // green-500
  closed: '#6B7280', // gray-500
};

const PRIORITY_COLORS = {
  low: '#9CA3AF', // gray-400
  medium: '#3B82F6', // blue-500
  high: '#F97316', // orange-500
  critical: '#EF4444', // red-500
};

/**
 * Analytics page — visualizations of ticket data.
 * 
 * Uses Recharts for charts. Gated by view_analytics permission.
 * Data is scoped to current organization.
 */
export function Analytics() {
  const { orgId } = useCurrentOrganization();
  const { can } = usePermission();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', orgId],
    queryFn: () => analyticsService.getAnalytics(orgId ?? undefined),
    enabled: can('view_analytics'),
  });

  if (isLoading) return <Loading />;

  if (!analytics || analytics.total === 0) {
    return (
      <PermissionGuard permission="view_analytics">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
          <EmptyState title="No data available" message="There are no tickets to analyze yet." />
        </div>
      </PermissionGuard>
    );
  }

  // Format data for Recharts
  const statusData = Object.entries(analytics.byStatus).map(([key, value]) => ({
    name: TICKET_STATUS_LABELS[key as keyof typeof TICKET_STATUS_LABELS],
    value,
    color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
  }));

  const priorityData = Object.entries(analytics.byPriority).map(([key, value]) => ({
    name: TICKET_PRIORITY_LABELS[key as keyof typeof TICKET_PRIORITY_LABELS],
    value,
    color: PRIORITY_COLORS[key as keyof typeof PRIORITY_COLORS],
  }));

  return (
    <PermissionGuard permission="view_analytics">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

        {/* Top stat */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Volume</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{analytics.total} <span className="text-lg font-normal text-gray-500">tickets</span></p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Status Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Tickets by Status</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Tickets by Priority</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent = 0 }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </PermissionGuard>
  );
}
