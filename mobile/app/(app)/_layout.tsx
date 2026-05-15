import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Stack } from 'expo-router'
import { useUser } from '@clerk/clerk-react-native'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'

const Tab = createBottomTabNavigator()

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/(auth)/sign-in')
    }
  }, [isSignedIn, isLoaded])

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="marketplace" options={{ title: 'Marketplace' }} />
      <Stack.Screen name="predictions" options={{ title: 'Predictions' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  )
}
