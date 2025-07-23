import Replicate from "replicate"

const replicate = new Replicate({ auth: process.env.NEXT_REPLICATE_API_TOKEN! })

export async function getResponseFromReplicateAI({
  prompt,
}: {
  prompt: string
}) {
  try {
    const input = {
      prompt,
    }

    const response = await replicate.run("minimax/video-01", { input })

    // To access the file URL:
    console.log(response.url())
    //=> "https://replicate.delivery/.../output.mp3"

    // To write the file to disk:
    // await writeFile("output.mp3", response)
    //=> output.mp3 written to disk

    return {
      data: response.url(),
      status: 200,
    }
  } catch (error) {
    console.log(error)
    return { status: 500, message: "SOMETHING WENT WRONG" }
  }
}
