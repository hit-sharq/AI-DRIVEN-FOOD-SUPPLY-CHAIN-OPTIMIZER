import { Stack } from 'expo-router'
import { useAuth } from '@clerk/expo'
import { useEffect } from 'react'
import { router } from 'expo-router'

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/(auth)/sign-in')
    }
  }, [isSignedIn, isLoaded])

  if (!isLoaded) return null
  if (!isSignedIn) return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="marketplace" options={{ title: 'Marketplace' }} />
      <Stack.Screen name="predictions" options={{ title: 'Predictions' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  )
}
