"use client"

import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

interface SubscriptionButtonProps {
  isPro?: boolean
}

export const SubscriptionButton = ({
  isPro = false,
}: SubscriptionButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/stripe")

      window.location.href = response.data.url
    } catch (error) {
      console.log("BILLING_ERROR", error)
      toast.error("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isPro ? "default" : "premium"}
      onClick={onClick}
      disabled={isLoading}
    >
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  )
}
