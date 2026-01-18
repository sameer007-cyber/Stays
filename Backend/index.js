import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://stays-911.vercel.app",
  "https://stays-oavv.vercel.app",
  "https://stays-nu.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(clerkMiddleware());

app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/likes", likeRoutes);

app.listen(8080, () => {
  console.log("Backend running on port 8080");
});
