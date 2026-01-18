import { NextResponse } from "next/server"

export const runtime = "nodejs" // REQUIRED

export async function GET() {
  // ⛔ DO NOT create ImageKit outside the handler
  const ImageKit = (await import("imagekit")).default

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

  if (!privateKey || !publicKey || !urlEndpoint) {
    return NextResponse.json(
      { error: "ImageKit env vars missing" },
      { status: 500 }
    )
  }

  const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  })

  const authParams = imagekit.getAuthenticationParameters()
  return NextResponse.json(authParams)
}
