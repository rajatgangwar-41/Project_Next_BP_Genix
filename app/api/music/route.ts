// import { getResponseFromReplicateAI } from "@/app/(dashboard)/(routes)/music/replicate"
import { getResponseFromGeminiAI } from "@/app/(dashboard)/(routes)/music/geminiiai"
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const body = await req.json()
    const { prompt } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 })
    }

    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 })
    }

    if (!isPro) await increaseApiLimit()

    // const replicateResponse = await getResponseFromReplicateAI({
    //   prompt,
    // })

    // if (replicateResponse.status === 200)
    //   return NextResponse.json(replicateResponse.data)

    const geminiAIResponse = await getResponseFromGeminiAI({
      prompt,
    })

    if (geminiAIResponse.status === 200)
      return NextResponse.json(geminiAIResponse.audioUrl)

    throw new Error("Something went wrong")
  } catch (error) {
    console.log("Error", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
