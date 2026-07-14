import type { Ticket } from '@/types/ticket';

/**
 * Seed data: Tickets across all 3 organizations.
 * 
 * We spread different statuses and priorities so:
 * - The ticket list page has variety to filter/sort
 * - The analytics page has meaningful chart data
 * - Some tickets are unassigned (assigneeId: null) to test assignment feature
 * 
 * Each ticket's organizationId ties it to exactly one org.
 * The creatorId and assigneeId reference users from THAT SAME org.
 */
export const tickets: Ticket[] = [
  // ========== EVEREST TECH (org-1) — 6 tickets ==========
  {
    id: 'ticket-1',
    title: 'Server deployment failing on staging',
    description: 'The CI/CD pipeline throws timeout errors when deploying to staging environment. Logs show connection reset after 30s.',
    status: 'open',
    priority: 'critical',
    organizationId: 'org-1',
    creatorId: 'user-tl-1',    // Priya (Team Lead) created it
    assigneeId: 'user-ag-1',   // Rajan (Agent) is working on it
    createdAt: '2025-06-01T09:00:00Z',
    updatedAt: '2025-06-01T09:00:00Z',
  },
  {
    id: 'ticket-2',
    title: 'Update SSL certificates before expiry',
    description: 'SSL certificates for api.everesttech.com expire on July 30. Need to renew and deploy new certs.',
    status: 'in_progress',
    priority: 'high',
    organizationId: 'org-1',
    creatorId: 'user-oa-1',    // Bikash (Org Admin)
    assigneeId: 'user-ag-1',   // Rajan (Agent)
    createdAt: '2025-05-20T14:30:00Z',
    updatedAt: '2025-06-02T10:00:00Z',
  },
  {
    id: 'ticket-3',
    title: 'Add monitoring for database connections',
    description: 'Set up alerts when DB connection pool usage exceeds 80%. Use Grafana dashboards.',
    status: 'open',
    priority: 'medium',
    organizationId: 'org-1',
    creatorId: 'user-tl-1',
    assigneeId: null,           // unassigned — tests the assign feature
    createdAt: '2025-06-03T11:00:00Z',
    updatedAt: '2025-06-03T11:00:00Z',
  },
  {
    id: 'ticket-4',
    title: 'Optimize Docker image sizes',
    description: 'Current images are 2GB+. Migrate to Alpine base and multi-stage builds to reduce to under 500MB.',
    status: 'resolved',
    priority: 'low',
    organizationId: 'org-1',
    creatorId: 'user-ag-1',
    assigneeId: 'user-ag-1',
    createdAt: '2025-04-10T08:00:00Z',
    updatedAt: '2025-05-15T16:00:00Z',
  },
  {
    id: 'ticket-5',
    title: 'Kubernetes pod crash loop in production',
    description: 'The payment-service pod keeps restarting every 5 minutes. OOMKilled errors in logs.',
    status: 'in_progress',
    priority: 'critical',
    organizationId: 'org-1',
    creatorId: 'user-oa-1',
    assigneeId: 'user-tl-1',
    createdAt: '2025-06-05T07:30:00Z',
    updatedAt: '2025-06-05T09:00:00Z',
  },
  {
    id: 'ticket-6',
    title: 'Document disaster recovery procedure',
    description: 'Write runbook for full system recovery including database restore steps.',
    status: 'closed',
    priority: 'medium',
    organizationId: 'org-1',
    creatorId: 'user-tl-1',
    assigneeId: 'user-ag-1',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-04-01T12:00:00Z',
  },

  // ========== LUMBINI SOLUTIONS (org-2) — 5 tickets ==========
  {
    id: 'ticket-7',
    title: 'Client onboarding form validation broken',
    description: 'The email field accepts invalid formats. Phone number field allows alphabetic characters.',
    status: 'open',
    priority: 'high',
    organizationId: 'org-2',
    creatorId: 'user-oa-2',
    assigneeId: 'user-ag-2',
    createdAt: '2025-06-02T13:00:00Z',
    updatedAt: '2025-06-02T13:00:00Z',
  },
  {
    id: 'ticket-8',
    title: 'Migrate legacy reports to new dashboard',
    description: 'Move 15 legacy Crystal Reports to the new React-based reporting dashboard. Maintain data accuracy.',
    status: 'in_progress',
    priority: 'medium',
    organizationId: 'org-2',
    creatorId: 'user-tl-2',
    assigneeId: 'user-ag-2',
    createdAt: '2025-05-15T09:00:00Z',
    updatedAt: '2025-06-01T14:00:00Z',
  },
  {
    id: 'ticket-9',
    title: 'API rate limiting not enforced',
    description: 'The public API has no rate limiting. A single client made 50k requests in one hour yesterday.',
    status: 'open',
    priority: 'critical',
    organizationId: 'org-2',
    creatorId: 'user-oa-2',
    assigneeId: null,           // unassigned
    createdAt: '2025-06-04T16:00:00Z',
    updatedAt: '2025-06-04T16:00:00Z',
  },
  {
    id: 'ticket-10',
    title: 'Set up automated testing pipeline',
    description: 'Configure Jest + React Testing Library in CI. Target 80% code coverage for core modules.',
    status: 'resolved',
    priority: 'medium',
    organizationId: 'org-2',
    creatorId: 'user-tl-2',
    assigneeId: 'user-tl-2',
    createdAt: '2025-04-20T10:00:00Z',
    updatedAt: '2025-05-25T11:00:00Z',
  },
  {
    id: 'ticket-11',
    title: 'Fix PDF export formatting issues',
    description: 'Generated invoices have overlapping text when client name exceeds 40 characters.',
    status: 'closed',
    priority: 'low',
    organizationId: 'org-2',
    creatorId: 'user-ag-2',
    assigneeId: 'user-ag-2',
    createdAt: '2025-03-10T08:00:00Z',
    updatedAt: '2025-03-20T15:00:00Z',
  },

  // ========== ANNAPURNA CORP (org-3) — 5 tickets ==========
  {
    id: 'ticket-12',
    title: 'Payment gateway timeout on checkout',
    description: 'Stripe API calls intermittently timeout during peak hours (6-9 PM). Affects ~5% of transactions.',
    status: 'open',
    priority: 'critical',
    organizationId: 'org-3',
    creatorId: 'user-oa-3',
    assigneeId: 'user-tl-3',
    createdAt: '2025-06-03T18:00:00Z',
    updatedAt: '2025-06-04T08:00:00Z',
  },
  {
    id: 'ticket-13',
    title: 'Add product search autocomplete',
    description: 'Implement Elasticsearch-powered search with autocomplete suggestions. Show top 5 matches.',
    status: 'in_progress',
    priority: 'medium',
    organizationId: 'org-3',
    creatorId: 'user-tl-3',
    assigneeId: 'user-ag-3',
    createdAt: '2025-05-28T10:00:00Z',
    updatedAt: '2025-06-02T12:00:00Z',
  },
  {
    id: 'ticket-14',
    title: 'Mobile app cart sync issue',
    description: 'Items added on mobile app do not appear in web cart. Session tokens are not shared correctly.',
    status: 'open',
    priority: 'high',
    organizationId: 'org-3',
    creatorId: 'user-ag-3',
    assigneeId: null,           // unassigned
    createdAt: '2025-06-05T14:00:00Z',
    updatedAt: '2025-06-05T14:00:00Z',
  },
  {
    id: 'ticket-15',
    title: 'Implement order tracking notifications',
    description: 'Send email + push notifications at each order status change: confirmed, shipped, delivered.',
    status: 'resolved',
    priority: 'medium',
    organizationId: 'org-3',
    creatorId: 'user-oa-3',
    assigneeId: 'user-ag-3',
    createdAt: '2025-04-15T09:00:00Z',
    updatedAt: '2025-05-20T17:00:00Z',
  },
  {
    id: 'ticket-16',
    title: 'Update privacy policy page',
    description: 'Legal team updated the privacy policy. Replace the old text and add cookie consent banner.',
    status: 'closed',
    priority: 'low',
    organizationId: 'org-3',
    creatorId: 'user-tl-3',
    assigneeId: 'user-ag-3',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-15T11:00:00Z',
  },
];
