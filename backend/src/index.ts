import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import okrRoutes from "./routes/okrs";
import metaRoutes from "./routes/meta";
import authRoutes from "./routes/auth";
import { TeamOkr } from "./models/teamOkr";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/alignops?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    try {
      const docs = await TeamOkr.find({}).limit(5).lean();
      console.log(
        "[Startup] team_okrs sample from MongoDB:",
        docs.length,
        "docs",
        docs.map((d) => ({ teamId: d.teamId, quarterId: d.quarterId }))
      );
    } catch (e) {
      console.error("[Startup] Failed to read from team_okrs collection", e);
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/okrs", okrRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

