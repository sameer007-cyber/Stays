import prisma from "../config/prisma.js";
import { geocodeLocation } from "../utils/geocode.js";

/**
 * GET /api/listings?location=&minPrice=&maxPrice=
 */
export const getListings = async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;

    const listings = await prisma.listing.findMany({
      where: {
        location: location
          ? { contains: location, mode: "insensitive" }
          : undefined,

        price:
          minPrice || maxPrice
            ? {
                gte: minPrice ? Number(minPrice) : undefined,
                lte: maxPrice ? Number(maxPrice) : undefined,
              }
            : undefined,
      },
      include: {
        reviews: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

/**
 * GET /api/listings/:id
 */
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

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
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const isOwner =
      req.auth?.userId && listing.ownerId === req.auth.userId;

    res.json({
      ...listing,
      isOwner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
};

/**
 * POST /api/listings
 */
export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      country,
      imageUrl,
    } = req.body;

    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🌍 Geocode address → latitude & longitude
    const { latitude, longitude } = await geocodeLocation(
      location,
      country
    );

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price,
        location,
        country,
        imageUrl,
        latitude,
        longitude,
        ownerId: req.auth.userId,
      },
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

/**
 * PUT /api/listings/:id
 */
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.ownerId !== req.auth.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

/**
 * DELETE /api/listings/:id
 */
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.ownerId !== req.auth.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.listing.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};
