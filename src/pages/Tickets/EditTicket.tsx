import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTicket, useUpdateTicket } from '../../hooks/useTickets';
import { usePermission } from '../../hooks/usePermission';
import { useCurrentOrganization } from '../../hooks/useCurrentOrganization';
import { PermissionGuard } from '../../guards/PermissionGuard';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';
import { users } from '../../data/users';
import { useEffect } from 'react';

const ticketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed'] as const),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  assigneeId: z.string().nullable(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

/**
 * EditTicket — edit an existing ticket.
 * 
 * Same form as CreateTicket but pre-populated with current values.
 * Uses useEffect to reset form when ticket data loads (async).
 */
export function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ticket, isLoading } = useTicket(id ?? '');
  const updateMutation = useUpdateTicket();
  const { can } = usePermission();
  const { orgId } = useCurrentOrganization();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  // Pre-populate form when ticket data loads
  useEffect(() => {
    if (ticket) {
      reset({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assigneeId: ticket.assigneeId,
      });
    }
  }, [ticket, reset]);

  if (isLoading) return <Loading />;
  if (!ticket) return <p className="p-6 text-gray-500">Ticket not found.</p>;

  const orgUsers = orgId ? users.filter((u) => u.organizationId === orgId) : users;

  const onSubmit = (data: TicketFormData) => {
    updateMutation.mutate(
      { id: ticket.id, data: { ...data, assigneeId: data.assigneeId || null } },
      { onSuccess: () => navigate(`/tickets/${ticket.id}`) }
    );
  };

  return (
    <PermissionGuard permission="edit_tickets">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Ticket</h1>

        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="title"
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select id="status" {...register('status')} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select id="priority" {...register('priority')} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {can('assign_tickets') && (
              <div>
                <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <select id="assigneeId" {...register('assigneeId')} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Unassigned</option>
                  {orgUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PermissionGuard>
  );
}
