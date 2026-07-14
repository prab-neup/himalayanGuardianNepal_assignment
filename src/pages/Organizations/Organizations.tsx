import { useQuery } from '@tanstack/react-query';
import { organizationService } from '../../services/organization.service';
import { useCurrentOrganization } from '../../hooks/useCurrentOrganization';
import { PermissionGuard } from '../../guards/PermissionGuard';
import { Loading } from '../../components/common/Loading';

/**
 * Organizations — directory of all organizations.
 * 
 * Platform users see all orgs. Org-level users see only their own.
 * Wrapped in PermissionGuard for manage_organizations.
 */
export function Organizations() {
  const { orgId, isPlatformUser } = useCurrentOrganization();

  const { data: allOrgs, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.getAll(),
  });

  if (isLoading) return <Loading />;

  // Filter: platform users see all, org users see only their own
  const visibleOrgs = isPlatformUser
    ? allOrgs
    : allOrgs?.filter((o) => o.id === orgId);

  return (
    <PermissionGuard permission="manage_organizations">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Organizations</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleOrgs?.map((org) => (
            <div key={org.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{org.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{org.description}</p>
              <p className="text-xs text-gray-400">
                Created: {new Date(org.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
}
