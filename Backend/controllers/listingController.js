import * as Listing from "../models/listingModel.js"
import prisma from "../config/prisma.js"

/**
 * GET /api/listings?location=&minPrice=&maxPrice=
 */
export const getListings = async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query

    const listings = await prisma.listing.findMany({
      where: {
        location: location
          ? { contains: location, mode: "insensitive" }
          : undefined,

        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
      },
      include: {
        reviews: true,
        owner: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json(listings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch listings" })
  }
}

export const getListingById = async (req, res) => {
  const { id } = req.params

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
  })

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" })
  }

  const isOwner = req.user
    ? listing.ownerId === req.user.id
    : false

  res.json({
    ...listing,
    isOwner,
  })
}



 
export const createListing = async (req, res) => {
  try {
    const listing = await Listing.createListing({
      ...req.body,
      ownerId: req.user.id,
    })

    res.status(201).json(listing)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

/**
 * PUT /api/listings/:id
 */
export const updateListing = async (req, res) => {
  const listing = await Listing.getListingById(req.params.id)

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" })
  }

  if (listing.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" })
  }

  const updated = await Listing.updateListing(req.params.id, req.body)
  res.json(updated)
}

/**
 * DELETE /api/listings/:id
 */
export const deleteListing = async (req, res) => {
  const listing = await Listing.getListingById(req.params.id)

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" })
  }

  if (listing.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" })
  }

  await Listing.deleteListing(req.params.id)
  res.json({ success: true })
}
