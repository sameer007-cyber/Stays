import prisma from "../config/prisma.js"

export const createReview = async (data) => {
  return prisma.review.create({ data })
}

export const getReviewsByListingId = async (listingId) => {
  return prisma.review.findMany({
    where: { listingId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export const deleteReview = async (id) => {
  await prisma.review.delete({ where: { id } })
}
