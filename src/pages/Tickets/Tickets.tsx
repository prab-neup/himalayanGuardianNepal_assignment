import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTickets, useDeleteTicket } from '../../hooks/useTickets';
import { usePermission } from '../../hooks/usePermission';
import { useSessionStore } from '../../store/sessionStore';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { PermissionGuard } from '../../guards/PermissionGuard';
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '../../data/defaults';
import { users } from '../../data/users';


/**
 * Status badge color mapping.
 */
const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

/**
 * Tickets — main ticket list page.
 * 
 * Shows a table of all tickets for the current org.
 * Actions (Create, Edit, Delete) are gated by permissions.
 * Agents only see tickets assigned to them.
 */
export function Tickets() {
  const { can } = usePermission();
  const currentUser = useSessionStore((state) => state.currentUser);
  const { data: tickets, isLoading } = useTickets();
  const deleteMutation = useDeleteTicket();
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (isLoading) return <Loading />;

  // Agents only see their assigned tickets
  let filteredTickets = tickets ?? [];
  if (currentUser.role === 'agent') {
    filteredTickets = filteredTickets.filter((t) => t.assigneeId === currentUser.id);
  }

  if (filteredTickets.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          {can('create_tickets') && (
            <Link to="/tickets/new">
              <Button>+ New Ticket</Button>
            </Link>
          )}
        </div>
        <EmptyState title="No tickets found" message="There are no tickets to display." />
      </div>
    );
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget);
      setDeleteTarget(null);
    }
  };

  // Get user name by ID for display
  const getUserName = (id: string | null) => {
    if (!id) return 'Unassigned';
    return users.find((u) => u.id === id)?.name ?? 'Unknown';
  };

  return (
    <PermissionGuard permission="view_tickets">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Tickets ({filteredTickets.length})
          </h1>
          {can('create_tickets') && (
            <Link to="/tickets/new">
              <Button>+ New Ticket</Button>
            </Link>
          )}
        </div>

        {/* Ticket Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Assignee</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  {/* Title — clickable link to detail */}
                  <td className="px-4 py-3">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {ticket.title}
                    </Link>
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
                      {TICKET_STATUS_LABELS[ticket.status]}
                    </span>
                  </td>

                  {/* Priority badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                      {TICKET_PRIORITY_LABELS[ticket.priority]}
                    </span>
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {getUserName(ticket.assigneeId)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {can('edit_tickets') && (
                        <button
                          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      )}
                      {can('delete_tickets') && (
                        <button
                          onClick={() => setDeleteTarget(ticket.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteTarget !== null}
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </PermissionGuard>
  );
}
