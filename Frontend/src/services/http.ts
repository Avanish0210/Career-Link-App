import { clearSession, getToken } from '../lib/auth';
import type { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === 'string'
        ? body || response.statusText
        : body?.message || body?.error || response.statusText;
    const error: ApiError = { status: response.status, message };
    throw error;
  }

  return body as T;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  auth = true
): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();

  if (auth && token) headers.set('Authorization', `Bearer ${token}`);
  if (!(init.body instanceof FormData) && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) clearSession();
  return parseResponse<T>(response);
}
