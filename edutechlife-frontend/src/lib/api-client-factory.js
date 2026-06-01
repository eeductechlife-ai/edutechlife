let _baseURL = '';
let _clerkToken = null;
let _onAuthError = null;

export const configureApiClient = ({ baseURL, onAuthError }) => {
  _baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || '';
  _onAuthError = onAuthError || null;
};

export const setClerkToken = (token) => {
  _clerkToken = token;
};

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (_clerkToken) {
    headers['Authorization'] = `Bearer ${_clerkToken}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401 && _onAuthError) {
      _onAuthError();
    }
    const body = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status}`
    }));
    const error = new Error(body.error || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return response.json();
};

const isAbortError = (error) => error?.name === 'AbortError';

const request = async (method, path, data = null, options = {}) => {
  const { signal, headers: extraHeaders } = options;
  try {
    const url = `${_baseURL}${path}`;
    const fetchOptions = {
      method,
      headers: { ...getAuthHeaders(), ...extraHeaders },
      signal,
    };
    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }
    const response = await fetch(url, fetchOptions);
    return handleResponse(response);
  } catch (error) {
    if (isAbortError(error)) return undefined;
    console.error(`[API] ${method} ${path} failed:`, error);
    throw error;
  }
};

export const apiClient = {
  get: (path, options) => request('GET', path, null, options),
  post: (path, data, options) => request('POST', path, data, options),
  put: (path, data, options) => request('PUT', path, data, options),
  delete: (path, options) => request('DELETE', path, null, options),
};
