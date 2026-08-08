import { z } from "zod"

function emptyToNull<T>(v: T | "" | undefined): T | null {
  return v === "" || v === undefined ? null : v
}

export const inquiryFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required.").max(200),
    company: z.string().trim().max(200).optional().transform(emptyToNull),
    phone_whatsapp: z.string().trim().min(6, "A phone or WhatsApp number is required.").max(40),
    email: z
      .union([z.string().trim().toLowerCase().email("Enter a valid email address."), z.literal("")])
      .optional()
      .transform(emptyToNull),
    rent_or_buy: z.enum(["rent", "buy"]),
    screen_type: z
      .union([
        z.enum([
          "led_wall",
          "lcd_video_wall",
          "commercial_display",
          "interactive_touch",
          "outdoor_weatherproof",
        ]),
        z.literal(""),
      ])
      .optional()
      .transform(emptyToNull),
    indoor_or_outdoor: z
      .union([z.enum(["indoor", "outdoor", "both"]), z.literal("")])
      .optional()
      .transform(emptyToNull),
    approx_size: z.string().trim().max(200).optional().transform(emptyToNull),
    budget: z.string().trim().max(200).optional().transform(emptyToNull),
    rental_start_date: z.string().trim().max(20).optional().transform(emptyToNull),
    rental_end_date: z.string().trim().max(20).optional().transform(emptyToNull),
    purpose: z.string().trim().max(2000).optional().transform(emptyToNull),
    product_id: z
      .union([z.string().uuid(), z.literal("")])
      .optional()
      .transform(emptyToNull),
  })
  .transform((values) => ({
    ...values,
    // Matches the DB constraint: rental dates only make sense when renting.
    rental_start_date: values.rent_or_buy === "rent" ? values.rental_start_date : null,
    rental_end_date: values.rent_or_buy === "rent" ? values.rental_end_date : null,
  }))

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>
