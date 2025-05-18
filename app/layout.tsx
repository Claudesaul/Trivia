import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import Header from "@/components/header"
import { UserProvider } from "@/context/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trivia",
  description: "Test your knowledge with thousands of trivia questions",
  generator: 'Claude B.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: { url: '/favicon.svg', type: 'image/svg+xml' }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-purple-950 dark:via-blue-950 dark:to-teal-950">
            <Header />
            <main>{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  )
}

