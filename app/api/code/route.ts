import { getResponseFromGeminiAI } from "@/app/(dashboard)/(routes)/code/geminiiai"
import { getResponseFromOpenAI } from "@/app/(dashboard)/(routes)/code/openai"
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { ChatCompletionMessageParam } from "openai/resources"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const body = await req.json()
    let { messages } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 })
    }

    const freeTrial = await checkApiLimit()

    if (!freeTrial) {
      return new NextResponse("Free trial has expired.", { status: 403 })
    }

    await increaseApiLimit()

    const openAIResponse = await getResponseFromOpenAI({ messages })

    if (openAIResponse.status === 200)
      return NextResponse.json(openAIResponse.data)

    messages = messages.map((item: ChatCompletionMessageParam) => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.content }],
    }))

    const geminiAIResponse = await getResponseFromGeminiAI({ messages })

    if (geminiAIResponse.status === 200)
      return NextResponse.json(geminiAIResponse.data)

    throw new Error("Something went wrong")
  } catch (error) {
    console.log("Error", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
