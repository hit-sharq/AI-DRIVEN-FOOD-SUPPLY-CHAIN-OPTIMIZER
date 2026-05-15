import { SignUp } from '@clerk/react'

export default function SignUpScreen() {
  return (
    <SignUp
      forceRedirectUrl="/(app)/dashboard"
      fallbackRedirectUrl="/(app)/dashboard"
    />
  )
}
