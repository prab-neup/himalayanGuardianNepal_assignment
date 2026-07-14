import axios from 'axios';

/**
 * Axios instance — the single HTTP client for the entire app.
 * 
 * Why create a separate instance instead of using axios directly?
 * 1. We can set baseURL, headers, interceptors in ONE place
 * 2. The mock adapter attaches to THIS instance only
 * 3. To switch to a real backend, just change the baseURL — nothing else changes
 * 
 * In a real app, you'd set:
 * - baseURL: 'https://api.fielddesk.io'
 * - headers: { Authorization: `Bearer ${token}` }
 * - interceptors for error handling (401 → redirect to login)
 * 
 * For this assignment, the mock adapter intercepts all requests
 * before they hit the network, so no real HTTP calls are made.
 */
export const apiClient = axios.create({
  baseURL: '/api', // all requests go to /api/* — intercepted by mock adapter
});
