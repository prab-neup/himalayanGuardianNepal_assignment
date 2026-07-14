/**
 * Possible ticket statuses — represents the lifecycle of a ticket.
 */
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

/**
 * Ticket priority levels.
 */
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Represents a support ticket.
 * 
 * Every ticket belongs to exactly one organization (organizationId).
 * This is how we enforce data isolation — when fetching tickets,
 * we always filter by the current org.
 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  organizationId: string; // which org this ticket belongs to — NEVER null
  creatorId: string;      // user who created it
  assigneeId: string | null; // user assigned to work on it — null means unassigned
  createdAt: string;
  updatedAt: string;
}

/**
 * Data needed to create a new ticket.
 * Omit removes fields the server would generate (id, timestamps).
 * We use this in the create form and the POST API call.
 */
export type CreateTicketDTO = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Data needed to update a ticket.
 * Partial means every field is optional — you only send what changed.
 * We exclude id/orgId/creatorId because those should never change after creation.
 */
export type UpdateTicketDTO = Partial<Omit<Ticket, 'id' | 'organizationId' | 'creatorId'>>;
