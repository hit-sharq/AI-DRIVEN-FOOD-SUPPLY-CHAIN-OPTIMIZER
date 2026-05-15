import Constants from 'expo-constants'
import axios from 'axios'

const getApiUrl = (): string => {
  const expoExtra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined
  if (expoExtra?.apiUrl) return expoExtra.apiUrl
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const envUrl = (globalThis as any).process?.env?.EXPO_PUBLIC_API_URL
  if (envUrl) return envUrl
  return 'http://localhost:3000'
}

const baseUrl = getApiUrl()

export const api = axios.create({
  baseURL: `${baseUrl.replace(/\/$/, '')}/api`,
  headers: { 'Content-Type': 'application/json' },
})

export default api
