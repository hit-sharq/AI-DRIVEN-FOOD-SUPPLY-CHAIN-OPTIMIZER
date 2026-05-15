import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
