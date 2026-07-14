import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTicket } from '../../hooks/useTickets';
import { usePermission } from '../../hooks/usePermission';
import { useCurrentOrganization } from '../../hooks/useCurrentOrganization';
import { useSessionStore } from '../../store/sessionStore';
import { PermissionGuard } from '../../guards/PermissionGuard';
import { Button } from '../../components/common/Button';
import { users } from '../../data/users';


/**
 * Zod validation schema for ticket creation.
 * 
 * WHY ZOD + REACT HOOK FORM?
 * - Zod defines the validation rules (min length, required, etc.)
 * - React Hook Form handles the form state (values, errors, submission)
 * - zodResolver connects them — RHF uses Zod to validate
 * - This means type-safe validation: the form data type is inferred from the schema
 */
const ticketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed'] as const),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  assigneeId: z.string().nullable(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export function CreateTicket() {
  const navigate = useNavigate();
  const createMutation = useCreateTicket();
  const currentUser = useSessionStore((state) => state.currentUser);
  const { orgId } = useCurrentOrganization();
  const { can } = usePermission();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      assigneeId: null,
    },
  });

  // Only show users from the current org in the assignee dropdown
  const orgUsers = orgId ? users.filter((u) => u.organizationId === orgId) : users;

  const onSubmit = (data: TicketFormData) => {
    createMutation.mutate(
      {
        ...data,
        assigneeId: data.assigneeId || null,
        organizationId: orgId ?? '',
        creatorId: currentUser.id,
      },
      {
        onSuccess: () => navigate('/tickets'),
      }
    );
  };

  return (
    <PermissionGuard permission="create_tickets">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Ticket</h1>

        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Brief summary of the issue"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Detailed description of the issue"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Status + Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  {...register('priority')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Assignee — only show if user can assign */}
            {can('assign_tickets') && (
              <div>
                <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <select
                  id="assigneeId"
                  {...register('assigneeId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Unassigned</option>
                  {orgUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Ticket'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/tickets')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PermissionGuard>
  );
}
