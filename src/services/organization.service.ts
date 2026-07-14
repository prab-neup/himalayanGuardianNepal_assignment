import { apiClient } from '../api/client';
import type { Organization } from '../types/organization';

/**
 * Organization service — all API calls related to organizations.
 * 
 * Why have a service layer between hooks and Axios?
 * 1. Hooks stay clean — they just call service.getAll() instead of knowing URLs
 * 2. If the API URL changes, we fix it in ONE place (here), not in every hook
 * 3. We add TypeScript return types here — so the response is typed all the way to the UI
 * 4. Easy to test — mock the service in unit tests instead of mocking Axios
 */
export const organizationService = {
  /** Fetch all organizations */
  getAll: async (): Promise<Organization[]> => {
    const response = await apiClient.get<Organization[]>('/organizations');
    return response.data; // Axios wraps response in { data, status, headers }. We unwrap it here.
  },

  /** Fetch a single organization by ID */
  getById: async (id: string): Promise<Organization> => {
    const response = await apiClient.get<Organization>(`/organizations/${id}`);
    return response.data;
  },
};
