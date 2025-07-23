import { GoogleGenAI } from "@google/genai"

const client = new GoogleGenAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY,
})

export async function getResponseFromGeminiAI({ prompt }: { prompt: string }) {
  try {
    let operation = await client.models.generateVideos({
      model: "veo-3.0-generate-preview",
      prompt,
    })

    // Poll the operation status until the video is ready
    while (!operation.done) {
      console.log("Waiting for video generation to complete...")
      await new Promise((resolve) => setTimeout(resolve, 10000))
      operation = await client.operations.getVideosOperation({
        operation: operation,
      })
    }

    // Download the generated video
    client.files.download({
      file: operation?.response?.generatedVideos?.[0]?.video,
      downloadPath: "dialogue_example.mp4",
    })
    console.log(`Generated video saved to dialogue_example.mp4`)

    return { data: "Done", status: 200 }
  } catch (error) {
    console.log("Video Error", error)
    return { status: 500, message: "SOMETHING WENT WRONG" }
  }
}
