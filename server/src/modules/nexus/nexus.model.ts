import { model, Schema } from "mongoose";
import { INexus, IScore } from "./nexus.interface";

const scoreSchema = new Schema<IScore>(
  {
    aesthetic_score: { type: Number, required: true },
    sentiment_score: { type: Number, required: true },
    memorability_score: { type: Number, required: true },
    art_evaluation_score: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const nexusSchema = new Schema<INexus>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    image_url: { type: String, required: true, trim: true },
    classification: { type: String, required: true, trim: true },
    classification_percentage: { type: Number, required: true },
    scores: { type: scoreSchema, required: true },
    art_value_usd: { type: Number, required: true },
    created_year: { type: String, required: true, trim: true },
    medium: { type: String, required: true, trim: true },
    tags: { type: [{ type: String, trim: true }], required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Nexus = model<INexus>("Nexus", nexusSchema);
export default Nexus;
