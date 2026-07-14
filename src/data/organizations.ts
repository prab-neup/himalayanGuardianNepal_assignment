import type { Organization } from '../types/organization';

/**
 * Seed data: 3 organizations.
 * The assignment says "Seed at least three organizations."
 * 
 * Each org is completely isolated — users from Org A can never see Org B's tickets.
 * We use simple string IDs prefixed with "org-" for readability when debugging.
 */
export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Everest Tech',
    slug: 'everest-tech',
    description: 'Cloud infrastructure and DevOps solutions provider.',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'org-2',
    name: 'Lumbini Solutions',
    slug: 'lumbini-solutions',
    description: 'Enterprise software consulting and development.',
    createdAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 'org-3',
    name: 'Annapurna Corp',
    slug: 'annapurna-corp',
    description: 'E-commerce platform and digital payments.',
    createdAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'org-4',
    name: 'Himalayan EcoTourism',
    slug: 'himalayan-ecotourism',
    description: 'Sustainable tourism in the Himalayas.',
    createdAt: '2025-02-10T00:00:00Z',
  },
];
