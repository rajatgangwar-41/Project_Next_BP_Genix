import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ServiceInactiveCardProps {
  onClose: () => void
}

export function ServiceInactiveCard({ onClose }: ServiceInactiveCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg relative">
      <CardContent className="flex items-center justify-between p-4">
        <p className="text-lg text-gray-700 font-semibold text-center flex-grow">
          Currently inactive and working on it. 🛠️
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="ml-4"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  )
}
