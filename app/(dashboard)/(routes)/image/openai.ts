import OpenAI from "openai"

const client = new OpenAI({ apiKey: process.env.NEXT_OPENAI_API_KEY })

export async function getResponseFromOpenAI({
  prompt,
  amount,
  resolution,
}: {
  prompt: string
  amount: string
  resolution: string
}) {
  try {
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      n: parseInt(amount, 10),
      size: [
        "auto",
        "1024x1024",
        "1536x1024",
        "1024x1536",
        "256x256",
        "512x512",
        "1792x1024",
        "1024x1792",
      ].includes(resolution)
        ? (resolution as
            | "auto"
            | "1024x1024"
            | "1536x1024"
            | "1024x1536"
            | "256x256"
            | "512x512"
            | "1792x1024"
            | "1024x1792")
        : "1024x1024",
    })

    // const response = await client.responses.create({
    //   model: "gpt-4.1-mini",
    //   input: prompt,
    //   tools: [{ type: "image_generation" }],
    // })

    console.log("Response From Open AI", response)

    return {
      data: response,
      status: 200,
    }
  } catch (error) {
    console.log(error)
    return { status: 500, message: "SOMETHING WENT WRONG" }
  }
}
