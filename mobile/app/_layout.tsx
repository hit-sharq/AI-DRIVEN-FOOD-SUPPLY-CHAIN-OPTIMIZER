import { ClerkProvider } from '@clerk/expo'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  )
}
