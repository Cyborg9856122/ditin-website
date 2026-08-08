import { z } from "zod"

// Business rules for a product record, independent of the DB or the form UI.
// Server actions parse FormData against this before touching the repository.
export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),
  category: z.enum([
    "led_wall",
    "lcd_video_wall",
    "commercial_display",
    "interactive_touch",
    "outdoor_weatherproof",
  ]),
  placement: z.enum(["indoor", "outdoor", "both"]),
  availability: z.enum(["rent", "buy", "both"]),
  pixel_pitch_mm: z
    .union([z.coerce.number().min(1).max(10), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  panel_size: z.string().trim().max(100).optional().transform((v) => v || null),
  brightness_nits: z
    .union([z.coerce.number().int().positive(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  resolution: z.string().trim().max(100).optional().transform((v) => v || null),
  typical_use_case: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => v || null),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
