import { getResponseFromGeminiAI } from "@/app/(dashboard)/(routes)/image/geminiiai"
import { getResponseFromOpenAI } from "@/app/(dashboard)/(routes)/image/openai"
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const body = await req.json()
    const { prompt, amount = 1, resolution = "512x512" } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 })
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 })
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 })
    }

    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 })
    }

    if (!isPro) await increaseApiLimit()

    const openAIResponse = await getResponseFromOpenAI({
      prompt,
      amount,
      resolution,
    })

    if (openAIResponse.status === 200)
      return NextResponse.json(openAIResponse.data)

    const geminiAIResponse = await getResponseFromGeminiAI({
      prompt,
      amount,
      resolution,
    })

    if (geminiAIResponse.status === 200)
      return NextResponse.json(geminiAIResponse.imageUrls)

    throw new Error("Something went wrong")
  } catch (error) {
    console.log("Error", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
