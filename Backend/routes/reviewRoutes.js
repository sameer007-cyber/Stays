import express from "express"
import {
  createReview,
  getReviewsByListingId,
  deleteReview,
} from "../controllers/reviewController.js"
import { syncUser } from "../middleware/syncUser.js"

const router = express.Router()

router.post("/", syncUser, createReview)
router.get("/listing/:listingId", getReviewsByListingId)
router.delete("/:id", syncUser, deleteReview)

export default router
