import "./globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ModalProvider } from "@/components/modal-provider"
import { Toaster } from "@/components/ui/sonner"
import { CrispProvider } from "@/components/crisp-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Genix",
  description:
    "Unleash Your Creativity: The Ultimate AI Content Generator. Generate anything you imagine! Our AI-powered platform empowers you to effortlessly create code, breathtaking images, unique music compositions, and compelling videos. Whether you're a developer, artist, musician, or content creator, streamline your workflow and bring your ideas to life with just a few clicks.",
  icons: {
    icon: "/icon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <CrispProvider />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ModalProvider />
          {children}
          <Toaster
            position="top-center"
            icons={{
              error: "❌",
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
