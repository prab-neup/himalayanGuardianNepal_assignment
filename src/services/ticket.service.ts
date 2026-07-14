import { apiClient } from '../api/client';
import type { Ticket, CreateTicketDTO, UpdateTicketDTO } from '../types/ticket';

/**
 * Ticket service — full CRUD operations.
 * 
 * This is the most used service in the app because tickets
 * are the core feature. Each method maps to one API endpoint:
 * 
 * getAll()       → GET    /tickets?orgId=xxx
 * getById()      → GET    /tickets/:id
 * create()       → POST   /tickets
 * update()       → PUT    /tickets/:id
 * delete()       → DELETE /tickets/:id
 * 
 * Notice: we use the DTO types (CreateTicketDTO, UpdateTicketDTO)
 * for the input params. These are the types from Phase 1 that use
 * Omit<> and Partial<> — they enforce that the frontend only sends
 * the fields the backend expects.
 */
export const ticketService = {
  /** Fetch all tickets, optionally filtered by organization */
  getAll: async (orgId?: string): Promise<Ticket[]> => {
    const response = await apiClient.get<Ticket[]>('/tickets', {
      params: orgId ? { orgId } : {},
    });
    return response.data;
  },

  /** Fetch a single ticket by ID */
  getById: async (id: string): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  /** Create a new ticket — backend generates id and timestamps */
  create: async (data: CreateTicketDTO): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>('/tickets', data);
    return response.data;
  },

  /** Update an existing ticket — only send changed fields */
  update: async (id: string, data: UpdateTicketDTO): Promise<Ticket> => {
    const response = await apiClient.put<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  /** Delete a ticket by ID */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  },
};
