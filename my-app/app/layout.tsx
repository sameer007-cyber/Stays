import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import Navbar from "@/components/navbar"
import "mapbox-gl/dist/mapbox-gl.css"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
