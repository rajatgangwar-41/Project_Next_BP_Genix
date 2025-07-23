import { GoogleGenAI } from "@google/genai"

const client = new GoogleGenAI({ apiKey: process.env.NEXT_GEMINI_API_KEY })

interface messagesType {
  role: "user" | "model"
  parts: [
    {
      text: string
    }
  ]
}

export async function getResponseFromGeminiAI({
  messages,
}: {
  messages: messagesType[]
}) {
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        temperature: 0.7,
        maxOutputTokens: 1500,
        topP: 0.95,
        topK: 40,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
      contents: messages,
    })

    console.log(
      "Response From Gemini AI",
      response?.candidates?.[0].content?.parts?.[0]?.text
    )

    if (!response.text) {
      throw new Error("Empty response from Gemini API")
    }

    return {
      data: {
        role: "assistant",
        content: response?.candidates?.[0].content?.parts?.[0]?.text,
      },
      status: 200,
    }
  } catch (error) {
    console.error("Gemini API Error:", error)
    return { status: 500, message: "SOMETHING WENT WRONG" }
  }
}
