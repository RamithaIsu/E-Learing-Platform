/** Product-level settings in one place. */
export const APP_CONFIG = {
  name: 'LearnSphere',
  tagline: 'E-learning management',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  requestTimeoutMs: 15_000,
  searchDebounceMs: 300,
  pageSize: { table: 10, grid: 9, related: 5, options: 100 },
  locale: 'en-LK',
  currency: 'LKR',
};
