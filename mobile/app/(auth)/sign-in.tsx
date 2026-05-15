import { SignIn } from '@clerk/react'
import { router } from 'expo-router'

export default function SignInScreen() {
  return (
    <SignIn
      forceRedirectUrl="/(app)/dashboard"
      fallbackRedirectUrl="/(app)/dashboard"
    />
  )
}
