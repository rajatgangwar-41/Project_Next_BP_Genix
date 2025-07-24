import { SignUp } from "@clerk/nextjs"

export default function Signup() {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignUp />
    </div>
  )
}
