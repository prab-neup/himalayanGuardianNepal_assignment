import { usePermissionStore } from '../../store/permissionStore';
import { PermissionGuard } from '../../guards/PermissionGuard';
import { Button } from '../../components/common/Button';
import { ALL_ROLES, ALL_PERMISSIONS, ROLE_LABELS, PERMISSION_LABELS } from '../../data/defaults';

/**
 * Permissions — the editable access control matrix.
 * 
 * This is where the assignment's requirement is fulfilled:
 * "Permissions should be stored as editable application data."
 * 
 * The Super Admin can toggle any checkbox here.
 * Because the whole app uses the usePermission() hook which subscribes
 * to this store, toggling a box here instantly hides/shows buttons
 * or blocks routes across the entire application without a reload.
 */
export function Permissions() {
  const permissions = usePermissionStore((state) => state.permissions);
  const togglePermission = usePermissionStore((state) => state.togglePermission);
  const resetPermissions = usePermissionStore((state) => state.resetPermissions);

  return (
    <PermissionGuard permission="manage_permissions">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Permission Matrix</h1>
            <p className="text-sm text-gray-500 mt-1">
              Changes take effect immediately across the entire application.
            </p>
          </div>
          <Button variant="secondary" onClick={resetPermissions}>
            Reset to Defaults
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 sticky left-0 bg-gray-50 border-r min-w-[200px]">
                  Permission \ Role
                </th>
                {ALL_ROLES.map((role) => (
                  <th key={role} className="px-4 py-3 font-medium text-gray-700 text-center whitespace-nowrap border-r last:border-r-0">
                    {ROLE_LABELS[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ALL_PERMISSIONS.map((action) => (
                <tr key={action} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white border-r group-hover:bg-gray-50 transition-colors">
                    {PERMISSION_LABELS[action]}
                  </td>
                  {ALL_ROLES.map((role) => {
                    const roleKey = role as keyof typeof permissions;
                    const actionKey = action as keyof typeof permissions[typeof roleKey];
                    const isChecked = permissions[roleKey][actionKey];
                    return (
                      <td key={`${role}-${action}`} className="px-4 py-3 text-center border-r last:border-r-0">
                        <label className="flex items-center justify-center cursor-pointer p-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(role, action)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PermissionGuard>
  );
}
