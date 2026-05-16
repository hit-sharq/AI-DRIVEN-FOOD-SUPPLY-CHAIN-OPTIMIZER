import Constants from 'expo-constants'
import axios, { type AxiosInstance, type Method } from 'axios'

/** Resolve the backend base URL for the mobile client. */
function getApiBaseUrl(): string {
  // ── 1. Explicit env var (most reliable)
  const envUrl = (globalThis as any)?.process?.env?.EXPO_PUBLIC_API_URL
  if (envUrl && typeof envUrl === 'string') {
    return envUrl.replace(/\/$/, '')
  }

  // ── 2. expo-extra from app.json (available on EAS / standalone builds)
  const expoExtra = Constants.expoConfig?.extra as
    | { apiUrl?: string; clerkPublishableKey?: string }
    | undefined
  if (expoExtra?.apiUrl) {
    return expoExtra.apiUrl.replace(/\/$/, '')
  }

  // ── 3. Clerk publishable key hint from app.json
  if (expoExtra?.clerkPublishableKey) {
    // If the key exists we're almost certainly on EAS; fall through to localhost
  }

  // ── 4. Safe local development default
  return __DEV__
    ? 'http://localhost:3000'
    : 'https://your-api-production-url.com'
}

/** Pure base URL of the Origin, e.g. `http://localhost:3000` */
export const baseUrl = getApiBaseUrl()

/** Configured Axios instance targeting `/api/*` endpoints. */
export const api: AxiosInstance = axios.create({
  baseURL: `${baseUrl}/api`,
  timeout: 30_000,
})

/** Signature-compatible wrappers so callers don't need to know axios internals. */
type Body =
  | Record<string, unknown>
  | FormData
  | string
  | null

type ExtraHeaders = Record<string, string>

function request<T>(
  method: Method,
  path: string,
  body?: Body,
  extraHeaders?: ExtraHeaders,
): Promise<{ data: T }> {
  // When FormData is passed we must NOT set Content-Type manually — the browser
  // adds the multipart boundary automatically.
  const isFormData = body instanceof FormData
  const headers: ExtraHeaders = { ...extraHeaders }
  if (!isFormData && !('Content-Type' in headers)) {
    headers['Content-Type'] = 'application/json'
  }
  return api.request<T>({ method, url: path, data: body, headers })
}

/** GET helper. */
export async function get<T>(path: string, config?: Record<string, unknown>): Promise<{ data: T }> {
  return api.get<T>(path, config)
}

/** POST helper — supports FormData transparently. */
export async function post<T>(path: string, body?: Body, headers?: ExtraHeaders): Promise<{ data: T }> {
  return request<T>('POST', path, body, headers)
}

/** PUT helper. */
export async function put<T>(path: string, body: Body, headers?: ExtraHeaders): Promise<{ data: T }> {
  return request<T>('PUT', path, body, headers)
}

/** DELETE helper. */
export async function del<T>(path: string, config?: Record<string, unknown>): Promise<{ data: T }> {
  return api.delete<T>(path, config)
}

export default api
