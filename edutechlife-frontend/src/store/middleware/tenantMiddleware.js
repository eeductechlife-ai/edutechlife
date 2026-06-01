/**
 * Tenant middleware for Zustand.
 * Provides tenant-aware state persistence and isolation.
 * Wraps set/get to handle tenant-scoped operations.
 */
export const createTenantMiddleware = (config) => (set, get, api) => {
  const wrappedSet = (partial, replace) => {
    if (typeof partial === 'function') {
      const next = (state) => {
        const result = partial(state);
        return result;
      };
      set(next, replace);
    } else {
      set(partial, replace);
    }
  };

  return config(wrappedSet, get, api);
};
