"use client"

import { use, useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type Props = {
  params: Promise<{ id: string }>
}

export default function EditListingPage({ params }: Props) {
  const { id } = use(params)
  const { getToken } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) return router.push("/")
      setForm(await res.json())
    }
    load()
  }, [id])

  function validate() {
    if (form.title.trim().length < 5)
      return "Title must be at least 5 characters"
    if ((form.description ?? "").trim().length < 20)
      return "Description must be at least 20 characters"
    if (!form.location) return "Location required"
    if (!form.country) return "Country required"
    if (!form.price || form.price <= 0)
      return "Price must be greater than 0"
    return null
  }

  async function submit() {
    const error = validate()
    if (error) return toast.error(error)

    try {
      setLoading(true)
      toast.loading("Saving changes...")

      const token = await getToken()

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      )

      if (!res.ok) throw new Error("Update failed")

      toast.dismiss()
      toast.success("Listing updated ✅")
      router.push(`/listings/${id}`)
    } catch (e: any) {
      toast.dismiss()
      toast.error(e.message || "Failed to update")
    } finally {
      setLoading(false)
    }
  }

  if (!form) return <p className="p-10">Loading…</p>

  return (
    <main className="mx-auto max-w-xl px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Edit listing</h1>

      <Input
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />
      <Input
        value={form.description ?? ""}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          value={form.location ?? ""}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />
        <Input
          value={form.country ?? ""}
          onChange={(e) =>
            setForm({ ...form, country: e.target.value })
          }
        />
      </div>

      <Input
        type="number"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />

      <Button
        className="w-full h-11"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Saving…" : "Save changes"}
      </Button>
    </main>
  )
}
