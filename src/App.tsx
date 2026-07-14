import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { router } from './router';

/**
 * App — the root component.
 * 
 * Wraps the router with Providers (React Query).
 * The mock adapter is initialized by importing it — 
 * we import it here so it's set up before any API calls happen.
 */

// This import initializes the mock adapter — it must happen before any API calls
import './api/mock';

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;