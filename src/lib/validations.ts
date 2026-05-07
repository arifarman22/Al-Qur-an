import { z } from "zod";

export const surahIdSchema = z.coerce.number().int().min(1).max(114);
export const searchSchema = z.object({ q: z.string().min(1).max(200).trim() });
