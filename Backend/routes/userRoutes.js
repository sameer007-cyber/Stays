import express from "express"
import { getUserById, deleteUser } from "../controllers/userController.js"

const router = express.Router()

router.get("/:id", getUserById)
router.delete("/:id", deleteUser)

export default router
