import mongoose from "mongoose";

const KeyResultSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: String, required: true },
    weightage: { type: Number, required: true },
    confidence: { type: Number, required: true },
    trend: { type: String, required: true },
    progress: { type: Number, required: true },
    lastUpdated: { type: String, required: true },
    comments: { type: String, required: false, default: "" }
  },
  { _id: false }
);

const ObjectiveSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    weightage: { type: Number },
    keyResults: { type: [KeyResultSchema], default: [] }
  },
  { _id: false }
);

const TeamOkrSchema = new mongoose.Schema(
  {
    ownerUserId: { type: String, required: false, index: true },
    teamId: { type: String, required: true, index: true },
    quarterId: { type: String, required: true, index: true },
    vision: { type: String, required: false, default: "" },
    strategy: { type: String, required: false, default: "" },
    objectives: { type: [ObjectiveSchema], default: [] }
  },
  {
    collection: "team_okrs",
    timestamps: true
  }
);

export const TeamOkr = mongoose.model("TeamOkr", TeamOkrSchema);

