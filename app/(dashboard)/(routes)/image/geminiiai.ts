import { GoogleGenAI, Modality } from "@google/genai"
import fs from "fs"
import path from "path"
import sharp from "sharp" // Import the sharp library

// Ensure your API key is correctly loaded for server-side use.
const client = new GoogleGenAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY,
})

export async function getResponseFromGeminiAI({
  prompt,
  amount = 1, // Number of images to generate (will result in 'amount' API calls)
  resolution = "1024x1024", // Default resolution, e.g., '512x512', '1024x768'
}: {
  prompt: string
  amount?: number
  resolution?: string // Desired output resolution (e.g., "512x512")
}) {
  const generatedImageUrls = []
  const generationErrors = []

  // Parse desired resolution
  const [targetWidthStr, targetHeightStr] = resolution.split("x")
  const targetWidth = parseInt(targetWidthStr, 10)
  const targetHeight = parseInt(targetHeightStr, 10)

  // Validate resolution
  if (
    isNaN(targetWidth) ||
    isNaN(targetHeight) ||
    targetWidth <= 0 ||
    targetHeight <= 0
  ) {
    return {
      status: 400,
      message:
        "Invalid resolution format. Please use 'WIDTHxHEIGHT' (e.g., '512x512').",
    }
  }

  for (let i = 0; i < amount; i++) {
    try {
      console.log(`Generating image ${i + 1} for prompt: "${prompt}"`)

      const response = await client.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE], // Request ONLY image data
        },
      })

      const imagePart = response?.candidates?.[0]?.content?.parts?.find(
        (part) =>
          part.inlineData && part?.inlineData?.mimeType?.startsWith("image/")
      )

      if (imagePart && imagePart.inlineData) {
        const imageData = imagePart.inlineData.data // Base64 string from Gemini
        const imageMimeType = imagePart.inlineData.mimeType || "image/png"
        const fileExtension = imageMimeType.split("/")[1]

        // 1. Decode Base64 to Buffer
        let buffer: Buffer = Buffer.from(imageData ?? "", "base64")

        // 2. Use Sharp to resize the image
        // Catch potential errors during image processing (e.g., invalid image data)
        try {
          buffer = await sharp(buffer)
            .resize(targetWidth, targetHeight, {
              fit: sharp.fit.inside, // Ensures the entire image fits within the dimensions
              withoutEnlargement: true, // Prevents upsizing if image is smaller than target
            })
            .toBuffer()
          console.log(
            `Image ${i + 1} resized to ${targetWidth}x${targetHeight}`
          )
        } catch (sharpError) {
          console.error(`Sharp resizing error for image ${i + 1}:`, sharpError)
          const errorMessage = `Image ${i + 1} could not be resized: ${
            sharpError instanceof Error && sharpError.message
              ? sharpError.message
              : "Unknown error"
          }`
          generationErrors.push(errorMessage)
          // Decide if you want to save the original unresized image or skip
          // For now, we'll continue with the original buffer if sharp fails to resize it
        }

        // Define the path to your Next.js public folder
        const publicFolderPath = path.join(process.cwd(), "public")

        // Generate a unique filename for each image
        const filename = `gemini-generated-image-${Date.now()}-${i}.${fileExtension}`
        const filePath = path.join(publicFolderPath, filename)

        // Save the (potentially resized) image file
        fs.writeFileSync(filePath, buffer)

        const imageUrl = `/${filename}` // URL accessible from the browser
        generatedImageUrls.push(imageUrl)
        console.log(`Image ${i + 1} saved successfully: ${filePath}`)
        console.log(`Accessible URL: ${imageUrl}`)
      } else {
        const errorMessage = `API call ${
          i + 1
        } succeeded but no image data found.`
        console.warn(errorMessage)
        generationErrors.push(errorMessage)
      }
    } catch (error) {
      console.error(`Error generating image ${i + 1}:`, error)
      generationErrors.push(
        `Failed to generate image ${i + 1}: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  if (generatedImageUrls.length > 0) {
    return {
      status: 200,
      imageUrls: generatedImageUrls,
      message: `${generatedImageUrls.length} image(s) generated and saved successfully.`,
      errors: generationErrors.length > 0 ? generationErrors : undefined,
    }
  } else {
    return {
      status: 500,
      message: "Failed to generate any images.",
      errors:
        generationErrors.length > 0
          ? generationErrors
          : ["Unknown error during image generation."],
    }
  }
}
