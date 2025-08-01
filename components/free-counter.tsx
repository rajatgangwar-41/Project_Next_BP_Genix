"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MAX_FREE_COUNTS } from "@/utils/constants"
import { Zap } from "lucide-react"
import { useProModal } from "@/hooks/use-pro-modal"

interface FreeCounterProps {
  apiLimitCount: number
  isPro: boolean
}

export const FreeCounter = ({
  apiLimitCount = 0,
  isPro = false,
}: FreeCounterProps) => {
  const proModal = useProModal()
  if (isPro) return null

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent>
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>
          <Button
            onClick={proModal.onOpen}
            className="w-full"
            variant="premium"
          >
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
