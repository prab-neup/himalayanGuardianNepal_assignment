/**
 * Represents an organization in the system.
 * Each org has its own users and tickets — data is isolated between orgs.
 */
export interface Organization {
  id: string;
  name: string;
  slug: string; // URL-friendly name, e.g. "everest-tech"
  description: string;
  createdAt: string; // ISO date string — we use string not Date because JSON doesn't have Date type
}
