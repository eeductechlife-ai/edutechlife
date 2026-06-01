let currentTenantId = 'default';
const listeners = new Set();

export const getTenantId = () => currentTenantId;

export const setTenantId = (id) => {
  if (id === currentTenantId) return;
  currentTenantId = id;
  listeners.forEach(fn => fn(id));
};

export const withTenant = (key) => `${currentTenantId}:${key}`;

export const TENANT_PREFIX = 'etl';

export const onTenantChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const TENANT_HEADER = 'x-tenant-id';
