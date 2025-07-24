import { SignIn } from "@clerk/nextjs"

export default function Signin() {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignIn />
    </div>
  )
}
