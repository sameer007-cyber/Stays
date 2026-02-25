import { findOrCreateUser } from "../models/userModel.js"
export const syncUser = async (req, res, next) => {
  const auth = req.auth();  

  const clerkId = auth?.userId;

  if (!clerkId) return next();

  const email =
    auth.sessionClaims?.email ||
    auth.sessionClaims?.email_address ||
    null;

  const name =
    auth.sessionClaims?.name ||
    auth.sessionClaims?.username ||
    "User";

  const user = await findOrCreateUser({
    clerkId,
    email,
    name,
  });

  req.user = user;
  next();
};