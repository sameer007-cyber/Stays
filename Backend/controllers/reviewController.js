import * as Review from "../models/reviewModel.js"

/**
 * POST /api/reviews
 */
export const createReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { rating, comment, listingId } = req.body

    if (!rating || !listingId) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const review = await Review.createReview({
      rating,
      comment,
      listingId,
      userId: req.user.id, // 🔥 from auth
    })

    res.status(201).json(review)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

/**
 * GET /api/reviews/listing/:listingId
 */
export const getReviewsByListingId = async (req, res) => {
  try {
    const reviews = await Review.getReviewsByListingId(req.params.listingId)
    res.status(200).json(reviews)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const review = await Review.getReviewById(req.params.id)

    if (!review) {
      return res.status(404).json({ error: "Review not found" })
    }

    // 🔒 OWNER CHECK
    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" })
    }

    await Review.deleteReview(req.params.id)
    res.status(200).json({ message: "Review deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
