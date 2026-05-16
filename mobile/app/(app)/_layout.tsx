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
      <Stack.Screen name="products" options={{ title: 'My Products' }} />
      <Stack.Screen name="products/new" options={{ title: 'Add Product' }} />
      <Stack.Screen name="listings" options={{ title: 'My Listings' }} />
      <Stack.Screen name="listings/new" options={{ title: 'New Listing' }} />
      <Stack.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  )
}
