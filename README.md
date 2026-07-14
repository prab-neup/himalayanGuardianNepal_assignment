# FieldDesk - Multi-Organization Ticket Dashboard

FieldDesk is a frontend dashboard built for managing support tickets across multiple organizations. It features a robust role-based access control (RBAC) system, multi-tenant data isolation, and dynamic permission management.

Built for the **HGN Assignment: Junior Frontend Developer** evaluation.

## 🚀 How to Install and Run

This project requires Node.js (v18 or newer recommended).

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd himalayanGuardain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Navigate to `http://localhost:5173` in your browser.

## 🛠️ Tech Stack & Libraries Used

This project relies on a carefully selected modern stack to meet the requirements efficiently:

- **React + TypeScript + Vite:** Fast development, strict type safety, and blazing fast builds.
- **Tailwind CSS:** For rapid, utility-first UI styling and responsive design.
- **Zustand:** For lightweight, boilerplate-free global state management (Session and Permissions).
- **React Query (`@tanstack/react-query`):** For asynchronous data fetching, caching, and cache-invalidation.
- **React Router (`react-router-dom`):** For client-side routing and layout management.
- **Axios + Axios Mock Adapter:** To simulate a real backend environment with network latency without needing a real server.
- **React Hook Form + Zod:** For performant, type-safe form state management and validation.
- **Recharts:** For rendering the Analytics charts (SVG-based, responsive data visualization).
- **Lucide React:** For clean, consistent SVG iconography.

## 🛠️ Tech Stack & Libraries Used

This project relies on a carefully selected modern stack to meet the requirements efficiently:

- **React + TypeScript + Vite:** Fast development, strict type safety, and blazing fast builds.
- **Tailwind CSS:** For rapid, utility-first UI styling and responsive design.
- **Zustand:** For lightweight, boilerplate-free global state management (Session and Permissions).
- **React Query (`@tanstack/react-query`):** For asynchronous data fetching, caching, and cache-invalidation.
- **React Router (`react-router-dom`):** For client-side routing and layout management.
- **Axios + Axios Mock Adapter:** To simulate a real backend environment with network latency without needing a real server.
- **React Hook Form + Zod:** For performant, type-safe form state management and validation.
- **Recharts:** For rendering the Analytics charts (SVG-based, responsive data visualization).
- **Lucide React:** For clean, consistent SVG iconography.

## 🧪 How to Test Different Users and Organizations

The application features a built-in **Session Simulator** accessible from the top Navbar.

1. **Switching Users:** 
   Use the **User** dropdown in the Navbar to switch between 11 seeded users (representing all 5 roles: Super Admin, Auditor, Org Admin, Team Lead, and Agent).
2. **Organization Scope:** 
   - **Platform-level users** (Super Admin, Auditor) oversee the entire platform. To prevent data from multiple client companies from mixing confusingly on one screen, they are provided with an **Org Filter Dropdown**. This acts as a scoping lens, allowing them to inspect one specific client organization at a time (or "All Organizations" combined).
   - **Organization-level users** (Org Admin, Team Lead, Agent) will not see the Org dropdown. For security and strict data isolation, their scope is permanently locked to their own company's data.
3. **Data Isolation:**
   When you switch users or organizations, the application automatically refetches data and re-evaluates permissions. You will see navigation links appear/disappear, buttons show/hide, and ticket lists filter instantly.

## 🔐 How Permissions are Stored and Updated

- **Single Source of Truth:** Permissions are stored as a mutable 2D matrix (`Record<Role, Record<PermissionAction, boolean>>`) in a **Zustand store** (`src/store/permissionStore.ts`).
- **Data, Not Code:** There are exactly zero hardcoded role checks (e.g., `if (role === 'admin')`) in the UI components. Every action is gated by checking the permission matrix: `if (can('delete_tickets'))`.
- **Runtime Updates:** Super Admins can visit the **Permissions** page to toggle checkboxes in the matrix. Because the entire application uses the `usePermission()` hook (which subscribes to the Zustand store), any change made in the matrix immediately triggers reactive re-renders across the app. Buttons will vanish, routes will be blocked, and sidebar links will disappear instantly without a page reload.

## ✅ Key Behaviors Demonstrated

- [x] **Data Isolation:** Organization-level users (via `useCurrentOrganization` hook) are strictly locked to their own company's data. Data from one organization is never exposed to another.
- [x] **Single Source of Truth:** All permissions live in a centralized, mutable 2D matrix inside the Zustand `permissionStore`.
- [x] **Instant Reactive Updates:** Toggling a matrix checkbox instantly re-evaluates the `usePermission()` hook everywhere. Routes, sidebars, controls, and actions update instantly without a page reload.
- [x] **No Duplicated Access Rules:** Zero `if (role === 'admin')` checks exist in the UI. Components solely rely on checking the central matrix via `if (can('action'))`.
- [x] **Clear States:** Loading spinners (via simulated 500ms API latency), empty states, and `<AccessDenied />` fallbacks are fully implemented.


## 🏗️ Important Technical Decisions

1. **Mock API Layer (`axios-mock-adapter`)**
   Instead of importing static JSON files directly into components, this app intercepts real Axios HTTP requests using `axios-mock-adapter`. 
   * **Why?** It perfectly mimics a real backend environment. Services perform actual GET/POST/PUT/DELETE requests. The mock adapter handles them, generates IDs, updates timestamps, and adds a `500ms` artificial delay so that loading states are actually visible. Switching to a real backend later would only require deleting the mock file and changing the Axios `baseURL`.

2. **State Management (`Zustand` & `React Query`)**
   * **Zustand:** Used for global synchronous state (current user, selected organization, permission matrix, UI sidebar state). It is lightweight and prevents unnecessary re-renders compared to React Context.
   * **React Query:** Used for all asynchronous API data (Tickets, Users, Organizations, Analytics). It handles loading states, caching, and automatic refetching. When a ticket is created/edited/deleted, React Query simply invalidates the cache, and the UI updates automatically.

3. **Data Transfer Objects (DTOs)**
   TypeScript types like `CreateTicketDTO` (using `Omit`) and `UpdateTicketDTO` (using `Partial`) are used to enforce strict contracts between the UI forms and the mock API, ensuring the frontend doesn't accidentally submit auto-generated fields like `id` or `createdAt`.

4. **React Hook Form + Zod**
   Forms (Create/Edit Ticket) are powered by `react-hook-form` and validated using `zod`. This ensures robust, type-safe form validation without heavy re-renders on every keystroke.

## ⚠️ Known Limitations / Features Omitted Due to Time

1. **Pagination & Infinite Scroll:** The ticket list currently renders all tickets for an organization at once. In a production environment with thousands of tickets, server-side pagination or infinite scrolling would be necessary.
2. **Full CRUD for Staff & Organizations:** The assignment emphasized ticket management and permissions. While you can view Staff and Organizations, creating/editing/deleting them was omitted to focus on the core requirements.
3. **Advanced Filtering/Sorting:** The ticket table does not currently support column sorting or advanced filtering (e.g., searching by title or filtering by specific statuses).
4. **Toast Notifications:** While operations like ticket creation and deletion succeed instantly via React Query invalidation, adding a toast notification system (e.g., `react-hot-toast`) would improve UX by providing explicit success feedback.

---

*Designed and built for Himalayan Guardian Nepal.*
