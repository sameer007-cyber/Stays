import express from "express"
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js"
import { syncUser } from "../middleware/syncUser.js"

const router = express.Router()

router.get("/", getListings)
router.get("/:id", syncUser,getListingById)

router.post("/", syncUser, createListing)
router.put("/:id", syncUser, updateListing)
router.delete("/:id", syncUser, deleteListing)

export default router
