import express from "express"
import prisma from "../config/prisma.js"
import { syncUser } from "../middleware/syncUser.js"

const router = express.Router()

router.post("/:listingId", syncUser, async (req, res) => {
  const { listingId } = req.params

  await prisma.like.upsert({
    where: {
      userId_listingId: {
        userId: req.user.id,
        listingId,
      },
    },
    update: {},
    create: {
      userId: req.user.id,
      listingId,
    },
  })

  res.json({ liked: true })
})

router.get("/", syncUser, async (req, res) => {
  const likes = await prisma.like.findMany({
    where: { userId: req.user.id },
    include: {
      listing: {
        include: { reviews: true },
      },
    },
  })

  res.json(likes.map(l => l.listing))
})

export default router
