const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
).replace(/\/+$/, '');

export interface RequestOptions extends RequestInit {
  token?: string;
}

export interface ApiCallResult<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Robust HTTP client that automatically injects auth tokens, handles 401 session expirations,
 * logs actionable error telemetry, and prevents silent failure masking.
 */
export async function requestApi<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiCallResult<T>> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const token =
    options.token ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('otd_access_token') : null);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('otd_access_token');
        window.dispatchEvent(new CustomEvent('otd_auth_error', { detail: { status: 401 } }));
      }
      return { data: null, error: 'Unauthorized: Session expired', status: 401 };
    }

    let json: any = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await res.json().catch(() => null);
    }

    if (!res.ok) {
      const errorMsg = json?.message || `Request failed with status ${res.status}`;
      console.warn(`[API ${res.status}] ${endpoint}:`, errorMsg);
      return { data: null, error: errorMsg, status: res.status };
    }

    return {
      data: (json?.data !== undefined ? json.data : json) as T,
      error: null,
      status: res.status,
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Network connection error';
    console.warn(`[API Network Error] ${endpoint}:`, errorMsg);
    return { data: null, error: errorMsg, status: 0 };
  }
}

export { API_BASE_URL };
