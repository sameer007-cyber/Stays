import ImageKit from "imagekit-javascript"

/**
 * ✅ IMPORTANT
 * - Do NOT use `authenticationEndpoint` here
 * - ImageKit JS typings do NOT support it
 * - Auth is handled manually during upload
 */

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
})

export default imagekit
