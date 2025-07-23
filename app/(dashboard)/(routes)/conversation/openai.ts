import OpenAI from "openai"

const client = new OpenAI({ apiKey: process.env.NEXT_OPENAI_API_KEY })

export async function getResponseFromOpenAI({ messages }: { messages: [] }) {
  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: messages,
    })

    console.log("Response From Open AI", response)

    return {
      data: { role: "assistant", content: response.output_text },
      status: 200,
    }
  } catch (error) {
    console.log(error)
    return { status: 500, message: "SOMETHING WENT WRONG" }
  }
}
