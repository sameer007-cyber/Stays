"use client"

import { useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import ImageKit from "imagekit-javascript"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus } from "lucide-react"
import { toast } from "sonner"

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  authenticationEndpoint: "/api/imagekit-auth",
} as any)

export default function CreateListingPage() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [country, setCountry] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isLoaded) return null
  if (!user) return <p className="p-10 text-center">Please sign in.</p>

  function validate() {
    if (title.trim().length < 5)
      return "Title must be at least 5 characters"
    if (description.trim().length < 20)
      return "Description must be at least 20 characters"
    if (!location.trim()) return "Location is required"
    if (!country.trim()) return "Country is required"
    if (!price || Number(price) <= 0)
      return "Price must be greater than 0"
    if (!image) return "Please upload an image"
    return null
  }

  async function submit() {
    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    try {
      setLoading(true)
      toast.loading("Creating listing...")

      // image → base64
      const base64 = await new Promise<string>((res, rej) => {
        const r = new FileReader()
        r.onload = () => res(r.result as string)
        r.onerror = rej
        r.readAsDataURL(image!)
      })

      const authRes = await fetch("/api/imagekit-auth")
      const { token, signature, expire } = await authRes.json()

      const upload = await imagekit.upload({
        file: base64,
        fileName: image!.name,
        folder: "/listings",
        token,
        signature,
        expire,
      })

      const jwt = await getToken()

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            title,
            description,
            location,
            country,
            price: Number(price),
            imageUrl: upload.url,
          }),
        }
      )

      if (!res.ok) throw new Error("Failed to create listing")

      toast.dismiss()
      toast.success("Listing published 🎉")
      window.location.href = "/"
    } catch (e: any) {
      toast.dismiss()
      toast.error(e.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 space-y-10">
      <h1 className="text-3xl font-semibold">Create your listing</h1>

      {/* IMAGE */}
      <label className="relative flex h-72 cursor-pointer items-center justify-center rounded-2xl border border-dashed text-muted-foreground hover:bg-muted transition">
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            className="absolute inset-0 h-full w-full rounded-2xl object-cover"
          />
        ) : (
          <>
            <ImagePlus className="h-8 w-8" />
            <span className="mt-2 text-sm">Upload cover photo</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </label>

      <div className="grid gap-6">
        <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <Input
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <Input
          type="number"
          placeholder="Price per night"
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <Button
        className="h-12 w-full text-base"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Creating…" : "Publish listing"}
      </Button>
    </main>
  )
}
