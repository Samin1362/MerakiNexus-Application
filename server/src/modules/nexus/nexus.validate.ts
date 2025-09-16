import { z } from "zod";

export const scoreSchema = z
  .object({
    aesthetic_score: z.number(),
    sentiment_score: z.number(),
    memorability_score: z.number(),
    art_evaluation_score: z.number(),
  })
  .strict();

export const nexusSchema = z
  .object({
    title: z.string().trim().min(1),
    artist: z.string().trim().min(1),
    image_url: z.string().trim().url(),
    classification: z.string().trim().min(1),
    classification_percentage: z.number(),
    scores: scoreSchema,
    art_value_usd: z.number(),
    created_year: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "must be a 4-digit year"),
    medium: z.string().trim().min(1),
    tags: z.array(z.string().trim()).nonempty(),
    user: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "must be a valid MongoDB ObjectId"),
  })
  .strict();

export const nexusUpdateSchema = nexusSchema.partial();
