"use client"

import * as z from "zod"
import { useRouter } from "next/navigation"
import { Music } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { formSchema } from "./constants"
import { Heading } from "@/components/heading"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Empty } from "@/components/empty"
import { Loader } from "@/components/loader"
import { ServiceInactiveCard } from "@/components/service-inactive-card" // Ensure this path is correct

const MusicPage = () => {
  const router = useRouter()
  const [music, setMusic] = useState<string | undefined>("")
  const [showInactiveCard, setShowInactiveCard] = useState<boolean>(false) // Renamed for clarity

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setShowInactiveCard(true) // Show the inactive card when generate is clicked
      setMusic("") // Clear any previous music

      console.log(values)

      // setMusic(response.data)
      form.reset()
    } catch (error) {
      console.log(error)
    } finally {
      router.refresh()
    }
  }

  // Function to close the inactive card
  const closeInactiveCard = () => {
    setShowInactiveCard(false)
  }

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Turn your prompt into music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 px-4 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Piano solo"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {showInactiveCard && (
            <ServiceInactiveCard onClose={closeInactiveCard} />
          )}
          {!music && !isLoading && !showInactiveCard && (
            <Empty label="No music generated." />
          )}
          {music && (
            <audio controls className="w-full mt-8">
              <source src={music} />
            </audio>
          )}
        </div>
      </div>
    </div>
  )
}

export default MusicPage
