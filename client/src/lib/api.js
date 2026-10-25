import { APP_CONFIG } from '../config/app';

/** An API failure with the server's error code and per-field details. */
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error?.message ?? 'Something went wrong. Please try again.');
    this.status = status;
    this.code = body?.error?.code;
    this.details = body?.error?.details ?? [];
  }
}

const networkError = (error) =>
  new ApiError(0, {
    error: {
      code: 'NETWORK_ERROR',
      message:
        error.name === 'TimeoutError'
          ? 'The server took too long to respond. Please try again.'
          : 'Cannot reach the server. Check that the API is running and try again.',
    },
  });

async function request(path, { method = 'GET', body, params } = {}) {
  const url = new URL(`${APP_CONFIG.apiBaseUrl}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(APP_CONFIG.requestTimeoutMs),
    });
  } catch (error) {
    throw networkError(error);
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);
  // A successful status without a JSON body means the request never reached the API.
  if (data === null) {
    throw new ApiError(response.status, {
      error: {
        code: 'INVALID_RESPONSE',
        message: 'The server sent an unexpected response. Please try again.',
      },
    });
  }
  return data;
}

export const api = {
  get: (path, params) => request(path, { params }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
