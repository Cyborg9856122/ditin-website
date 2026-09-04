import { z } from "zod"

// Business rules for a product record, independent of the DB or the form UI.
// Server actions parse FormData against this before touching the repository.
export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(200),
  category: z.enum([
    "led_wall",
    "lcd_video_wall",
    "commercial_display",
    "interactive_touch",
    "outdoor_weatherproof",
  ]),
  placement: z.enum(["indoor", "outdoor", "both"]),
  availability: z.enum(["rent", "buy", "both"]),
  typical_use_case: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => v || null),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
