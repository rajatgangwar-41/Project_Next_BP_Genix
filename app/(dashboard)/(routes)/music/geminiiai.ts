import { GoogleGenAI } from "@google/genai"
import fs from "fs"
import path from "path"
import { WaveFile } from "wavefile" // npm install wavefile

const client = new GoogleGenAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY,
})

export async function getResponseFromGeminiAI({
  prompt,
  durationSeconds = 10,
  bpm = 120,
  density = 0.5,
  brightness = 0.5,
  scale = "C_MAJOR",
}: {
  prompt: string
  durationSeconds?: number
  bpm?: number
  density?: number
  brightness?: number
  scale?: string
}) {
  let session
  const audioBufferChunks = []
  const outputPath = path.join(
    process.cwd(),
    "public",
    `generated-music-${Date.now()}.wav`
  )
  const generationErrors = []

  try {
    // 1. Connect to the Lyria RealTime model via the Live API
    session = await client.live.connect({
      model: "models/lyria-realtime-exp",
      initialRequest: {
        configure: {
          musicGenerationConfig: {
            bpm: bpm,
            density: density,
            brightness: brightness,
            scale: scale,
          },
          weightedPrompts: [
            {
              text: prompt,
              weight: 1.0,
            },
          ],
        },
      },
      callbacks: {
        message: (message) => {
          if (message.audio) {
            audioBufferChunks.push(Buffer.from(message.audio))
          }
          if (message.filteredPrompt) {
            console.warn(
              "Prompt was filtered by safety systems:",
              message.filteredPrompt.reason
            )
            generationErrors.push(
              `Prompt filtered: ${message.filteredPrompt.reason}`
            )
          }
          if (message.debugInfo) {
            console.log("Debug Info:", message.debugInfo)
          }
        },
        close: (code, reason) => {
          console.log(`Music session closed. Code: ${code}, Reason: ${reason}`)
        },
        error: (error) => {
          console.error("Music session error:", error)
          generationErrors.push(`Session error: ${error.message}`)
        },
      },
    })

    console.log("Connected to Lyria RealTime session. 🎶")

    // 2. Send the 'play' command to start music generation
    // Use session.send() with a PlaybackControl message
    await session.send({
      playbackControl: { play: {} }, // Correct way to send the play command
    })
    console.log(`Music generation started for: "${prompt}"`)

    // 3. Generate for the specified duration
    await new Promise((resolve) => setTimeout(resolve, durationSeconds * 1000))

    // 4. Send the 'stop' command to end generation
    // Use session.send() with a PlaybackControl message
    await session.send({
      playbackControl: { stop: {} }, // Correct way to send the stop command
    })
    console.log("Music generation stopped.")
  } catch (error) {
    console.error("Error during music generation setup or session:", error)
    generationErrors.push(`Music generation failed: ${error.message}`)
    if (session) {
      try {
        session.close()
      } catch (closeError) {
        console.error(
          "Error attempting to close session on failure:",
          closeError
        )
      }
    }
    return {
      status: 500,
      message: `Failed to start or complete music generation: ${error.message}`,
      errors: generationErrors,
    }
  }

  // 5. Process and save the collected audio chunks
  if (audioBufferChunks.length > 0) {
    const combinedAudioBuffer = Buffer.concat(audioBufferChunks)

    try {
      const wav = new WaveFile()
      // Lyria RealTime outputs 48kHz stereo, 16-bit PCM (LINEAR16)
      wav.fromScratch(
        2, // 2 channels for stereo
        48000, // 48 kHz sample rate
        "16", // 16-bit PCM
        combinedAudioBuffer
      )
      fs.writeFileSync(outputPath, wav.toBuffer())
      console.log(`Music saved to ${outputPath}`)
    } catch (audioProcessingError) {
      console.error(
        "Error processing or saving audio file with wavefile:",
        audioProcessingError
      )
      generationErrors.push(
        `Failed to process or save audio file: ${audioProcessingError.message}`
      )
      return { status: 500, message: "Failed to process or save audio file." }
    }

    return {
      status: 200,
      audioUrl: `/${path.basename(outputPath)}`,
      message: "Music generated and saved successfully.",
      errors: generationErrors.length > 0 ? generationErrors : undefined,
    }
  } else {
    console.warn("No audio data received from the model after session ended.")
    return {
      status: 404,
      message: "No audio data was generated or received.",
      errors:
        generationErrors.length > 0
          ? generationErrors
          : ["No audio data received from the model."],
    }
  }
}
