import { Router } from "express";
import { TeamOkr } from "../models/teamOkr";

const router = Router();

// GET /api/okrs?teamId=&quarterId=&userId=
router.get("/", async (req, res) => {
  const { teamId, quarterId, userId } = req.query;

  const query: Record<string, unknown> = {};
  if (typeof userId === "string" && userId.trim() !== "") {
    query.ownerUserId = userId;
  }
  if (typeof teamId === "string" && teamId.trim() !== "") {
    query.teamId = teamId;
  }
  if (typeof quarterId === "string" && quarterId.trim() !== "") {
    query.quarterId = quarterId;
  }

  try {
    const okrs = await TeamOkr.find(query).lean();
    res.json(okrs);
  } catch (error) {
    console.error("Error fetching OKRs", error);
    res.status(500).json({ error: "Failed to fetch OKRs" });
  }
});

// POST /api/okrs
// Creates or updates an OKR document for a given userId + teamId + quarterId
router.post("/", async (req, res) => {
  const payload = req.body;

  if (!payload || !payload.teamId || !payload.quarterId || !payload.ownerUserId) {
    return res
      .status(400)
      .json({ error: "ownerUserId, teamId and quarterId are required in request body" });
  }

  try {
    const updated = await TeamOkr.findOneAndUpdate(
      { ownerUserId: payload.ownerUserId, teamId: payload.teamId, quarterId: payload.quarterId },
      payload,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error saving OKR", error);
    res.status(500).json({ error: "Failed to save OKR" });
  }
});

export default router;

