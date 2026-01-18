import express from "express"
import cors from "cors"
import "dotenv/config"
import { clerkMiddleware } from "@clerk/express"

import userRoutes from "./routes/userRoutes.js"
import listingRoutes from "./routes/listingRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import likeRoutes from "./routes/likeRoutes.js"

const app = express()

app.use(express.json())

import cors from "cors"

const allowedOrigins = [
  "http://localhost:3000",
  "https://stays-mcug.vercel.app",
  "https://stays-mcug-git-main-sameer-dharmadhikaris-projects.vercel.app",
]

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)


app.use(clerkMiddleware())

app.use("/api/users", userRoutes)
app.use("/api/listings", listingRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/likes", likeRoutes)

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
