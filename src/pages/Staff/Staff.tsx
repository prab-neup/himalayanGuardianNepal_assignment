import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { useCurrentOrganization } from '../../hooks/useCurrentOrganization';
import { PermissionGuard } from '../../guards/PermissionGuard';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { ROLE_LABELS } from '../../data/defaults';
import { organizations } from '../../data/organizations';

/**
 * Staff — lists users/staff members.
 * 
 * Org users see staff from their org only.
 * Platform users see staff from the selected org (or all).
 * Gated by manage_staff permission.
 */
export function Staff() {
  const { orgId } = useCurrentOrganization();

  const { data: staffList, isLoading } = useQuery({
    queryKey: ['users', orgId],
    queryFn: () =>
      orgId ? userService.getByOrganization(orgId) : userService.getAll(),
  });

  if (isLoading) return <Loading />;

  return (
    <PermissionGuard permission="manage_staff">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Staff</h1>

        {!staffList || staffList.length === 0 ? (
          <EmptyState title="No staff found" message="No users in this organization." />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Organization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffList.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.organizationId
                        ? organizations.find((o) => o.id === user.organizationId)?.name ?? '—'
                        : 'Platform'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
