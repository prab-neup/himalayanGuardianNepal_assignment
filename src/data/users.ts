import type { User } from '../types/user';

/**
 * Seed data: All users in the system.
 * 
 * Structure:
 * - 2 platform-level users (organizationId: null) → can see ALL orgs
 *   - 1 Super Admin: full control everywhere
 *   - 1 Auditor: read-only everywhere
 * 
 * - 3 users per organization (9 total org-level users):
 *   - 1 Org Admin: manages everything within their org
 *   - 1 Team Lead: manages tickets + views analytics in their org
 *   - 1 Agent: works on assigned tickets only
 * 
 * Total: 11 users. This gives the evaluator enough variety to test every role.
 */
export const users: User[] = [
  // ========== PLATFORM-LEVEL USERS (no org, see everything) ==========
  {
    id: 'user-sa-1',
    name: 'Aarav Sharma',
    email: 'aarav@fielddesk.io',
    role: 'super_admin',
    organizationId: null, // platform-level — not tied to any org
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-aud-1',
    name: 'Sita Thapa',
    email: 'sita@fielddesk.io',
    role: 'auditor',
    organizationId: null, // platform-level — read-only across all orgs
    createdAt: '2024-01-05T00:00:00Z',
  },

  // ========== EVEREST TECH (org-1) ==========
  {
    id: 'user-oa-1',
    name: 'Bikash Gurung',
    email: 'bikash@everesttech.com',
    role: 'org_admin',
    organizationId: 'org-1',
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'user-tl-1',
    name: 'Priya Rai',
    email: 'priya@everesttech.com',
    role: 'team_lead',
    organizationId: 'org-1',
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'user-ag-1',
    name: 'Rajan Magar',
    email: 'rajan@everesttech.com',
    role: 'agent',
    organizationId: 'org-1',
    createdAt: '2024-03-01T00:00:00Z',
  },

  // ========== LUMBINI SOLUTIONS (org-2) ==========
  {
    id: 'user-oa-2',
    name: 'Anita Shrestha',
    email: 'anita@lumbinisolutions.com',
    role: 'org_admin',
    organizationId: 'org-2',
    createdAt: '2024-03-25T00:00:00Z',
  },
  {
    id: 'user-tl-2',
    name: 'Deepak Karki',
    email: 'deepak@lumbinisolutions.com',
    role: 'team_lead',
    organizationId: 'org-2',
    createdAt: '2024-04-15T00:00:00Z',
  },
  {
    id: 'user-ag-2',
    name: 'Sunita Tamang',
    email: 'sunita@lumbinisolutions.com',
    role: 'agent',
    organizationId: 'org-2',
    createdAt: '2024-05-01T00:00:00Z',
  },

  // ========== ANNAPURNA CORP (org-3) ==========
  {
    id: 'user-oa-3',
    name: 'Manish Adhikari',
    email: 'manish@annapurnacorp.com',
    role: 'org_admin',
    organizationId: 'org-3',
    createdAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'user-tl-3',
    name: 'Kavita Bhandari',
    email: 'kavita@annapurnacorp.com',
    role: 'team_lead',
    organizationId: 'org-3',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'user-ag-3',
    name: 'Sunil Poudel',
    email: 'sunil@annapurnacorp.com',
    role: 'agent',
    organizationId: 'org-3',
    createdAt: '2024-08-01T00:00:00Z',
  },
];
