import prisma from "../config/prisma.js"

export const getAllListings = async () => {
  return prisma.listing.findMany({
    include: {
      reviews: true,
      owner: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export const getListingById = async (id) => {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true } },
      reviews: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
  })
}

export const createListing = async (data) => {
  return prisma.listing.create({ data })
}

export const updateListing = async (id, data) => {
  return prisma.listing.update({
    where: { id },
    data,
  })
}

export const deleteListing = async (id) => {
  await prisma.listing.delete({ where: { id } })
  return true
}
