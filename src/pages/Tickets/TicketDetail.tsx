import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTicket } from '../../hooks/useTickets';
import { usePermission } from '../../hooks/usePermission';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '../../data/defaults';
import { users } from '../../data/users';
import { organizations } from '../../data/organizations';

/**
 * TicketDetail — view a single ticket with all its information.
 * 
 * Shows title, description, status, priority, assignee, creator, dates.
 * Edit/Delete buttons only show if user has those permissions.
 */
export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(id ?? '');
  const { can } = usePermission();
  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  if (!ticket) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Ticket not found.</p>
        <Link to="/tickets" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          ← Back to tickets
        </Link>
      </div>
    );
  }

  const creator = users.find((u) => u.id === ticket.creatorId);
  const assignee = ticket.assigneeId ? users.find((u) => u.id === ticket.assigneeId) : null;
  const org = organizations.find((o) => o.id === ticket.organizationId);

  return (
    <div className="p-6">
      {/* Back link */}
      <Link to="/tickets" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to tickets
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Header with title + action buttons */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          <div className="flex gap-2">
            {can('edit_tickets') && (
              <Button variant="secondary" onClick={() => navigate(`/tickets/${ticket.id}/edit`)}>
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
          <p className="text-gray-700">{ticket.description}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
            <p className="text-sm font-medium">{TICKET_STATUS_LABELS[ticket.status]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Priority</p>
            <p className="text-sm font-medium">{TICKET_PRIORITY_LABELS[ticket.priority]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Assignee</p>
            <p className="text-sm font-medium">{assignee?.name ?? 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Creator</p>
            <p className="text-sm font-medium">{creator?.name ?? 'Unknown'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Organization</p>
            <p className="text-sm font-medium">{org?.name ?? 'Unknown'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Created</p>
            <p className="text-sm font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Updated</p>
            <p className="text-sm font-medium">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
