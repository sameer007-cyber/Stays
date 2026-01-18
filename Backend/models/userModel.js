import prisma from "../config/prisma.js"
import bcrypt from "bcrypt"

export const findOrCreateUser = async ({ clerkId, email, name }) => {
  let user = await prisma.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        name,
        email: email ?? null, // ✅ SAFE
        password: await bcrypt.hash("clerk", 10),
      },
    })
  }

  return user
}

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  })
}

export const deleteUser = async (id) => {
  await prisma.user.delete({ where: { id } })
  return true
}
