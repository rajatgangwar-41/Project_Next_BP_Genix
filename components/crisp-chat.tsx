"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("02e437af-41d0-4b0c-a1dd-bf883f78627f")
  }, [])

  return null
}
