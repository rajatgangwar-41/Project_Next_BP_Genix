import Replicate from "replicate"

const replicate = new Replicate({ auth: process.env.NEXT_REPLICATE_API_TOKEN })

export async function getResponseFromReplicateAI({
  prompt,
}: {
  prompt: string
}) {
  try {
    const input = {
      prompt,
      model_version: "stereo-large",
      output_format: "mp3",
      normalization_strategy: "peak",
    }

    const response = await replicate.run(
      "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      { input }
    )

    // To access the file URL:
    console.log("Replicate Response", response.url())
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
