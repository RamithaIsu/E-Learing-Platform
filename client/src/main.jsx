import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './router';
import './styles/index.css';

const MAX_RETRIES = 2;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Retry only network and server failures; a 4xx will not fix itself.
      retry: (failureCount, error) =>
        failureCount < MAX_RETRIES && (error.status === 0 || error.status >= 500),
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton toastOptions={{ duration: 4000 }} />
    </QueryClientProvider>
  </StrictMode>,
);
