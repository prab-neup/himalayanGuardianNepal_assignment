import { apiClient } from '../api/client';
import type { User } from '../types/user';

/**
 * User service — API calls for fetching users/staff.
 * 
 * Note: We don't have user CRUD (create/update/delete users) because
 * the assignment says "basic staff management" — viewing the list is enough.
 * If you wanted to add it, you'd add create/update/delete methods here
 * and matching mock routes in mock.ts.
 */
export const userService = {
  /** Fetch all users. Platform-level users call this to see everyone. */
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  /**
   * Fetch users belonging to a specific organization.
   * Org-level users call this — they only see their own org's staff.
   * The orgId is passed as a query param: GET /users?orgId=org-1
   */
  getByOrganization: async (orgId: string): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users', {
      params: { orgId },
    });
    return response.data;
  },
};
