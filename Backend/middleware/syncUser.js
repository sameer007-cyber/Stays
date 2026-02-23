import { findOrCreateUser } from "../models/userModel.js"

export const syncUser = async (req, res, next) => {
  const clerkId = req.auth?.userId

  if (!clerkId) {
    return next()
  }

  const email =
    req.auth.sessionClaims?.email ||
    req.auth.sessionClaims?.email_address ||
    null

  const name =
    req.auth.sessionClaims?.name ||
    req.auth.sessionClaims?.username ||
    "User"

  const user = await findOrCreateUser({
    clerkId,
    email,
    name
  })

  req.user = user
  next()
}