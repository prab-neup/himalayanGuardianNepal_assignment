import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './client';
import { organizations } from '../data/organizations';
import { users } from '../data/users';
import { tickets as seedTickets } from '../data/tickets';
import type { Ticket, CreateTicketDTO } from '../types/ticket';

/**
 * Mock API layer using axios-mock-adapter.
 * 
 * HOW IT WORKS:
 * 1. MockAdapter intercepts requests made through our apiClient
 * 2. Instead of hitting the network, it runs our handler functions
 * 3. We add artificial delays (300-800ms) to simulate real network latency
 * 4. This gives us loading states in the UI — just like a real app
 * 
 * WHY THIS APPROACH?
 * - Components call services → services call apiClient → mock intercepts
 * - The UI code has NO idea it's talking to fake data
 * - To switch to a real backend: delete this file, change the baseURL in client.ts
 * - Nothing else changes — not a single component or hook
 * 
 * delayResponse: 500 → every response waits 500ms before returning.
 * This makes Loading components visible during development.
 */
const mock = new MockAdapter(apiClient, { delayResponse: 500 });

/**
 * In-memory data store.
 * We spread [...seedTickets] to create a mutable copy.
 * This way we can add/edit/delete tickets at runtime without
 * affecting the original seed data.
 */
let ticketsDB: Ticket[] = [...seedTickets];

/**
 * Simple ID generator for new tickets.
 * In a real app, the backend generates IDs (UUID, auto-increment, etc.)
 */
let nextTicketId = ticketsDB.length + 1;

// ==================== ORGANIZATION ENDPOINTS ====================

/**
 * GET /organizations
 * Returns all organizations.
 * Filtering by user access happens in the service/hook layer, not here.
 * The API returns everything — the frontend decides what to show.
 */
mock.onGet('/organizations').reply(() => {
  return [200, organizations];
});

/**
 * GET /organizations/:id
 * Returns a single organization by ID.
 */
mock.onGet(/\/organizations\/[\w-]+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const org = organizations.find((o) => o.id === id);
  if (org) {
    return [200, org];
  }
  return [404, { message: 'Organization not found' }];
});

// ==================== USER ENDPOINTS ====================

/**
 * GET /users
 * Optional query param: ?orgId=xxx to filter by organization.
 * If no orgId, returns ALL users (platform-level views need this).
 */
mock.onGet('/users').reply((config) => {
  const orgId = config.params?.orgId;
  if (orgId) {
    const filtered = users.filter((u) => u.organizationId === orgId);
    return [200, filtered];
  }
  return [200, users];
});

// ==================== TICKET ENDPOINTS ====================

/**
 * GET /tickets
 * Optional query param: ?orgId=xxx to filter by organization.
 * This is the main list endpoint.
 */
mock.onGet('/tickets').reply((config) => {
  const orgId = config.params?.orgId;
  if (orgId) {
    const filtered = ticketsDB.filter((t) => t.organizationId === orgId);
    return [200, filtered];
  }
  return [200, ticketsDB];
});

/**
 * GET /tickets/:id
 * Returns a single ticket by ID.
 */
mock.onGet(/\/tickets\/[\w-]+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const ticket = ticketsDB.find((t) => t.id === id);
  if (ticket) {
    return [200, ticket];
  }
  return [404, { message: 'Ticket not found' }];
});

/**
 * POST /tickets
 * Creates a new ticket.
 * The request body contains CreateTicketDTO (no id or timestamps).
 * We generate the id and timestamps here — just like a real backend would.
 */
mock.onPost('/tickets').reply((config) => {
  const data: CreateTicketDTO = JSON.parse(config.data);
  const newTicket: Ticket = {
    ...data,
    id: `ticket-${nextTicketId++}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  ticketsDB.push(newTicket);
  return [201, newTicket];
});

/**
 * PUT /tickets/:id
 * Updates an existing ticket.
 * Uses spread to merge old data with new data — only changed fields overwrite.
 */
mock.onPut(/\/tickets\/[\w-]+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const updates = JSON.parse(config.data);
  const index = ticketsDB.findIndex((t) => t.id === id);

  if (index === -1) {
    return [404, { message: 'Ticket not found' }];
  }

  ticketsDB[index] = {
    ...ticketsDB[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return [200, ticketsDB[index]];
});

/**
 * DELETE /tickets/:id
 * Removes a ticket from the in-memory array.
 */
mock.onDelete(/\/tickets\/[\w-]+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const index = ticketsDB.findIndex((t) => t.id === id);

  if (index === -1) {
    return [404, { message: 'Ticket not found' }];
  }

  ticketsDB.splice(index, 1);
  return [200, { message: 'Ticket deleted' }];
});

// ==================== ANALYTICS ENDPOINT ====================

/**
 * GET /analytics?orgId=xxx
 * Computes analytics from ticket data on the fly.
 * In a real app, the backend might have pre-computed aggregations.
 * Here we just count tickets by status and priority.
 */
mock.onGet('/analytics').reply((config) => {
  const orgId = config.params?.orgId;
  const filtered = orgId
    ? ticketsDB.filter((t) => t.organizationId === orgId)
    : ticketsDB;

  const analytics = {
    total: filtered.length,
    byStatus: {
      open: filtered.filter((t) => t.status === 'open').length,
      in_progress: filtered.filter((t) => t.status === 'in_progress').length,
      resolved: filtered.filter((t) => t.status === 'resolved').length,
      closed: filtered.filter((t) => t.status === 'closed').length,
    },
    byPriority: {
      low: filtered.filter((t) => t.priority === 'low').length,
      medium: filtered.filter((t) => t.priority === 'medium').length,
      high: filtered.filter((t) => t.priority === 'high').length,
      critical: filtered.filter((t) => t.priority === 'critical').length,
    },
  };

  return [200, analytics];
});

export { mock };
