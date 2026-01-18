import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://stays-mcug.vercel.app",
      "https://stays-mcug-git-main-sameer-dharmadhikaris-projects.vercel.app",
      "https://stays-nu.vercel.app"
    ],
    credentials: true,
  })
);

// Clerk AFTER CORS
app.use(clerkMiddleware());

/* -------------------- ROUTES -------------------- */

app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/likes", likeRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
