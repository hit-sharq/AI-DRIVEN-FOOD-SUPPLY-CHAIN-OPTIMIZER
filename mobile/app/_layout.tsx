import { ClerkProvider } from '@clerk/expo'
import { Stack } from 'expo-router'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch {
      return
    }
  },
}

const publishableKey =
  Constants.expoConfig?.extra?.clerkPublishableKey ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  ''

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  )
}
